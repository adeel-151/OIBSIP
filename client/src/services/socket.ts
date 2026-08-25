import { io } from 'socket.io-client';

// Construct the base URL by stripping /api from VITE_API_URL if present
let baseURL = import.meta.env.VITE_API_URL || 'https://oibsip-xnyz.onrender.com/api';
baseURL = baseURL.replace(/\/api$/, ''); // Remove trailing /api

export const socket = io(baseURL, { 
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
