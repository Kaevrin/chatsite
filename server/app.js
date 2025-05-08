const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // or restrict to your GitHub Pages domain
    methods: ["GET", "POST"]
  }
});

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected');
  let username = "Anonymous";
  

  socket.on('set username', (name) => {
    username = name;
    console.log(`${username} has joined the chat`);
    io.emit(`${username} has joined the chat`);
    io.emit('welcome message', { username });
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', {username, message: msg});
  });

  socket.on('disconnect', () => {
    console.log(`${username} disconnected`);
  });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
