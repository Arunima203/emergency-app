const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());
// Static files serve করার জন্য
app.use(express.static(path.join(__dirname, "..")));

let alerts = [];

// Socket.IO কানেকশন হ্যান্ডলিং
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // ১. লোকেশন রিসিভ করা (ইউজার থেকে)
    socket.on("send-location", (data) => {
        console.log("New Location received:", data);
        alerts.push(data);
        // সব স্টাফকে নতুন এলার্টের তথ্য পাঠানো
        io.emit("new-emergency", data); 
    });

    // ২. 'Solved' বাটনের জন্য ইভেন্ট
    socket.on("solve-emergency", (emergencyId) => {
        console.log("Emergency solved:", emergencyId);
        // লিস্ট থেকে ওই এলার্ট সরিয়ে ফেলা
        alerts = alerts.filter(alert => alert.time !== emergencyId);
        // অন্য সব স্টাফকে জানানো যাতে তাদের স্ক্রিন থেকেও মুছে যায়
        io.emit("emergency-solved", emergencyId);
    });

    // ৩. ডিসকানেক্ট হওয়া
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
}); // <--- io.on এর শেষ ব্র্যাকেট এটি

// সার্ভার লিসেন সবসময় একদম শেষে এবং সব ব্লকের বাইরে থাকবে
server.listen(3000, () => {
    console.log("Server running on port 3000");
});