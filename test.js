const chatNamespace1 = io.of("/chat1");
const chatNamespace2 = io.of("/chat2");

chatNamespace1.on("connection", (socket) => {
  console.log("A client connected to /chat1 namespace!");

  // Lắng nghe sự kiện "chat message" từ client
  socket.on("chat message", (message) => {
    console.log(`Received message in /chat1 namespace: ${message}`);
    
    // Gửi tin nhắn cho tất cả các client trong cùng room
    chatNamespace1.to(message.room).emit("chat message", message);
  });

  // Tham gia vào một room
  socket.on("join room", (room) => {
    console.log(`Client joined room ${room}`);
    socket.join(room);
  });

  // Rời khỏi một room
  socket.on("leave room", (room) => {
    console.log(`Client left room ${room}`);
    socket.leave(room);
  });
});

chatNamespace2.on("connection", (socket) => {
  console.log("A client connected to /chat2 namespace!");

  // Lắng nghe sự kiện "chat message" từ client
  socket.on("chat message", (message) => {
    console.log(`Received messagein /chat2 namespace: ${message}`);
    
    // Gửi tin nhắn cho tất cả các client trong cùng room
    chatNamespace2.to(message.room).emit("chat message", message);
  });

  // Tham gia vào một room
  socket.on("join room", (room) => {
    console.log(`Client joined room ${room}`);
    socket.join(room);
  });

  // Rời khỏi một room
  socket.on("leave room", (room) => {
    console.log(`Client left room ${room}`);
    socket.leave(room);
  });
});