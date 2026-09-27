const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`user connected: ${socket.id}`);
  let currentRoom=null;

//   join room
socket.on("join_room",(roomName)=>{
    if(currentRoom){
        socket.leave(currentRoom)
        console.log(`${socket.id} left the rooms  ${currentRoom}`);
    }
    socket.join(roomName)
    currentRoom=roomName;
      console.log(`${socket.id} joined the rooms  ${roomName}`);
})

  // listen messages
  socket.on("send_message", ({ msg,roomName }) => {
    console.log(msg);
    // socket.emit("receive", msg);
    socket.to(roomName).emit("receive",msg);
  });

  socket.on("disconnect", () => {
    console.log(`user disconnected: ${socket.id}`);
  });
});

server.listen(3000, () => {
  console.log("server is running...");
});
