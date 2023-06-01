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

let countPp;
io.on("connection", (socket) => {
  console.log("New user connected");
  countPp++;

  let userId;
  socket.on("login", (data) => {
    userId = data.userId;
    console.log(userId);
  });
  // gui tin nhan di {socketId, senderId, message}

  // nhan ve {senderId, message, isYourMessage}
  socket.on("chat message", (data) => {
    console.log(socket.id);
    let isYourMessage = false;
    const { socketId, ...other } = data;
    if (socketId == socket.id) {
      isYourMessage = true;
    }
    console.log(other);
    io.emit("chat message", { ...other, isYourMessage });
  });
  // Xử lý sự kiện ngắt kết nối
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.get("/", (req, res) => {
  return res.sendFile(__dirname + "/index.html");
});

//multer config
upload;
initRouter(app);

server.listen(PORT, () => {
  console.log(`App is running at port: ${PORT}`);
});

module.exports = app;
