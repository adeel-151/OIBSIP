require('dotenv').config();
const http = require('http');
const app = require('./app');
const mongoose = require('mongoose');
const https = require('https');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Setup MongoDB connection
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
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
