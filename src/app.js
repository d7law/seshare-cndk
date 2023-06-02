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
const TokenOneSignal = require("./models/TokenOneSignal");
const { checkToken } = require("./middleware/checkToken");
const { default: mongoose } = require("mongoose");
const { formatMessageTime } = require("./utils/format-date");
const {
  SendNotification,
  SendNotificationToDevice,
} = require("../utils/send-notification");

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
io.on("connection", (socket) => {
  console.log("New user connected");
  let userId;
  socket.on("login", (data) => {
    userId = data.userId;
    console.log(userId);
  });
  // gui tin nhan di {socketId, senderId, message}

  // nhan ve {senderId, message, isYourMessage}
  socket.on("seshare chat", (data) => {
    const { ...message } = data;
    const timeSend = formatMessageTime();
    io.emit("seshare chat", { ...message, timeSend: timeSend });
  });
  // Xử lý sự kiện ngắt kết nối
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.get("/", (req, res) => {
  return res.sendFile(__dirname + "/index.html");
});
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

app.post("/chat", checkToken, async (req, res) => {
  const userA = new mongoose.Types.ObjectId(res.locals.payload.id);
  const userB = new mongoose.Types.ObjectId(req.body.userB);

  // Find Room
  let foundRoom = await Chat.findOne({ user: { $all: [userA, userB] } });
  if (!foundRoom) {
    foundRoom = await Chat.create({ content: "", user: [userA, userB] });
  }

  let roomId = foundRoom._id.toString();
  let listToken = await TokenOneSignal.find({
    user: new mongoose.Types.ObjectId(data.userB),
  });
  listToken = listToken.map((x) => x.token_signal);
  console.log(listToken);
  SendNotificationToDevice(
    listToken,
    `${res.locals.userName} vừa yêu cầu nhắn tin với bạn. Trò chuyện ngay thôi <3`,
    (error, results) => {
      if (error) {
        console.log(err);
      }
      console.log(results);
    }
  );
  return res.json({ roomId: roomId });
});

//multer config
upload;
initRouter(app);

server.listen(PORT, () => {
  console.log(`App is running at port: ${PORT}`);
});

module.exports = app;
