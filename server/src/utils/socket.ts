import { Server } from 'socket.io';

let io;

export default {
  init: (httpServer) => {
    io = new Server(httpServer, {
      cors: {
        origin: function (origin: any, callback: any) {
          callback(null, true);
        },
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
        credentials: true
      }
    });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  }
};
