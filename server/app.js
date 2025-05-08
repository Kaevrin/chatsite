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
app.use(cookieParser());
const cors = require('cors');

app.use(cors({
  origin: 'https://kaevrin.github.io',
  credentials: true
}));

app.get('/', function(req, resp) {
  resp.cookie('myFirstCookie', 'looks good', {
    maxAge: 60000,
    sameSite: 'None',
    secure: true
});
  resp.send('Cookie sent');
})

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