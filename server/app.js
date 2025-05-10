const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://kaevrin.github.io",
    methods: ["GET", "POST"],
    credentials: true,
  }
});


// Socket.IO logic
io.on('connection', (socket) => {
  let userId = null;
  let username = "Anonymous";

  socket.on('set user info', (data) => {
    username = data.username || "Anonymous";
    userId = data.userId || null;
    console.log(`User ${username} (${userId}) has joined`);
    io.emit('welcome message', { username });
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', { username, message: msg });
  });

  socket.on('disconnect', () => {
    console.log(`${username} disconnected`);
  });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});