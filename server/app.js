const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://kaevrin.github.io", // You can restrict this to your domain later
    methods: ["GET", "POST"],
    credentials: true,
  }
});



// Serve static files (like your frontend)

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
    io.emit('disconnect message', { username });
  });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});