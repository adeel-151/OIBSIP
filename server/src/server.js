require('dotenv').config();
import http from 'http';
import app from './app.js';
import mongoose from 'mongoose';
import https from 'https';
import inventoryJobs from './jobs/inventoryJobs.js';
import socketUtils from './utils/socket.js';
import { connectRedis } from './utils/redis.js';

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Setup MongoDB connection
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Connect to Redis
    await connectRedis();

    // Initialize Scheduled Jobs
    inventoryJobs.initJobs();

    // Initialize Socket.io
    const io = socketUtils.init(server);
    io.on('connection', (socket) => {
      console.log('Client connected to Socket.io:', socket.id);

      socket.on('join_user_room', (userId) => {
        socket.join(`user_${userId}`);
        console.log(`Socket ${socket.id} joined room user_${userId}`);
      });

      socket.on('join_admin_room', () => {
        socket.join('admin_room');
        console.log(`Socket ${socket.id} joined admin_room`);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);

      // Auto ping every 10 minutes (600000 ms) to keep Render instance awake
      setInterval(() => {
        https.get('https://oibsip-xnyz.onrender.com/', (res) => {
          console.log(`Pinged server to keep awake, Status: ${res.statusCode}`);
        }).on('error', (err) => {
          console.error(`Error pinging server: ${err.message}`);
        });
      }, 10 * 60 * 1000);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();