const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

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

  //set user info and send welcome message to all users
  socket.on('set user info', (data) => {
    username = data.username || "Anonymous";
    userId = data.userId || null;
    console.log(`User ${username} (${userId}) has joined`);
    io.emit('welcome message', { username });
  });

  //receive and send chat messages, has character limit value.
  socket.on('chat message', (msg) => {
    const maxlength = 2000;
    msgOutput = msg.slice(0, maxlength);
    io.emit('chat message', { username, message: msgOutput });
  });

  //Send disconnect message to active users
  socket.on('disconnect', () => {
    console.log(`${username} disconnected`);
    io.emit('disconnect message', { username });
  });
});

//Confirm server booted
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});