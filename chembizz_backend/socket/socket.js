
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const cors = require('cors');
const fs = require("fs");
const https = require("https");
const path = require("path");

let server 

const httpsOptions = {
    key: null,
    cert: null,
  };

//   try {
//     // Try reading the SSL files (Only available on the VM)
//     httpsOptions.key = fs.readFileSync(path.join(__dirname, '../selfsigned.key'), 'utf8');
//     httpsOptions.cert = fs.readFileSync("/etc/ssl/certs/selfsigned.crt");

//     server= https.createServer(httpsOptions, app)
//     console.log("✅ HTTPS mode: Server is running securely");
        
//   } catch (error) {
//     console.log("⚠️ SSL certificates not found. Running in HTTP mode.");
//     console.error("❌ SSL error:", error.message);
//     server = http.createServer(app);
//   }

server = http.createServer(app);


const io = new Server(server, {
    cors: {
        // origin: ["http://localhost:3000", "http://chembizz.com", "http://localhost:5173" , "http://3.108.65.195:4000", , "http://localhost:3001"],
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    },
});
app.use(cors());




const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId != undefined) userSocketMap[userId] = socket.id;

    // io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // socket.on() is used to listen to the events. can be used both on client and server side
    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};


module.exports = { app, io, server, getReceiverSocketId, userSocketMap };