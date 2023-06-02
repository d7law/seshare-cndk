const express = require("express");
const userRoute = require("./routes/user.route");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./config/database");
const friendRoute = require("./routes/friend.route");
const path = require("path");
const morgan = require("morgan");
const multer = require("multer");
const http = require("http");
const socketIO = require("socket.io");
const initRouter = require("./routes");
const { default: upload } = require("./services/upload.service");
require("dotenv").config();
const Chat = require("./models/Chat");
const { checkToken } = require("./middleware/checkToken");
const { default: mongoose } = require("mongoose");

db();

const PORT = process.env.PORT;

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
//app.use(express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("combined"));

// Handle socket.io
const server = http.createServer(app);
const io = socketIO(server);

// Handle chat

app.post("/api/chat/get-list-chat", checkToken, async (req, res) => {
  const userId = new mongoose.Types.ObjectId(res.locals.payload.id);
  const listRoom = await Chat.find({ user: { $in: [userId] } })
    .lean()
    .populate("user", "full_name avatar_path");
  const result = listRoom.map((item) => {
    const newVar = item.user.filter((user) => user._id != userId.toString());
    return {
      ...item,
      user: newVar[0],
    };
  });
  return res.status(200).json({ status: true, data: result });
});

let roomId;
app.post("/chat", checkToken, async (req, res) => {
  const userA = new mongoose.Types.ObjectId(res.locals.payload.id);
  const userB = new mongoose.Types.ObjectId(req.body.userB);

  // Find Room
  let foundRoom = await Chat.findOne({ user: { $in: [userA, userB] } });
  if (!foundRoom) {
    foundRoom = await Chat.create({ content: "", user: [userA, userB] });
  }

  roomId = foundRoom._id.toString();

  return res.json({ roomId: roomId });
});
io.on("connection", (socket) => {
  console.log("New user connected");

  console.log(roomId);
  let userId;
  socket.on("login", (data) => {
    userId = data.userId;
    console.log(userId);
  });
  // gui tin nhan di {socketId, senderId, message}

  // nhan ve {senderId, message, isYourMessage}
  socket.on(`${roomId}`, (data) => {
    console.log(socket.id);
    let isYourMessage = false;
    const { socketId, ...other } = data;
    if (socketId && socketId === socket.id) {
      isYourMessage = true;
    }
    console.log(other);
    io.emit(`${roomId}`, { ...other, isYourMessage });
  });
  // Xử lý sự kiện ngắt kết nối
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
//multer config
upload;
initRouter(app);

server.listen(PORT, () => {
  console.log(`App is running at port: ${PORT}`);
});

module.exports = app;
