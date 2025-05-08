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

// Middleware to parse cookies
app.use(cookieParser());

// Set a cookie if it doesn't exist
app.use((req, res, next) => {
  if (!req.cookies.user_id) {
    const newId = crypto.randomUUID();
    console.log("Setting new user_id cookie:", newId);
    res.cookie('user_id', newId, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      sameSite: 'None',
      secure: true,
    });
    req.user_id = newId;
  } else {
    req.user_id = req.cookies.user_id;
  }
  next();
});

// Serve static files (like your frontend)
app.use(express.static('public'));

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('A user connected');
  let username = "Anonymous";

  socket.on('set username', (name) => {
    username = name;
    console.log(`${username} has joined the chat`);
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