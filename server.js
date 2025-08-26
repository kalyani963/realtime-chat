const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public")); // serve frontend

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join", (data) => {
    socket.join(data.room);
    io.to(data.room).emit("message", {
      name: "System",
      msg: `${data.name} joined ${data.room}`
    });
  });

  socket.on("message", (data) => {
    io.to("general").emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));
