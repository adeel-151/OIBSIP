import { Server } from 'socket.io';
let io;
export default {
    init: (httpServer) => {
        io = new Server(httpServer, {
            cors: {
                origin: [
                    'http://localhost:5173',
                    'http://localhost:3000',
                    'https://pizzaro-gamma.vercel.app'
                ],
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
