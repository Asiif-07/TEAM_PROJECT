import { Server } from "socket.io";

let io;
// Map of userId -> Set of socketIds for real-time targeting
const userSocketMap = {};

export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId) {
            if (!userSocketMap[userId]) {
                userSocketMap[userId] = new Set();
            }
            userSocketMap[userId].add(socket.id);
            console.log(`[Socket] User ${userId} connected with socket ${socket.id}`);
            console.log(`[Socket] Active sockets for ${userId}:`, Array.from(userSocketMap[userId]));
        }

        socket.on("disconnect", () => {
            if (userId && userSocketMap[userId]) {
                userSocketMap[userId].delete(socket.id);
                console.log(`[Socket] User ${userId} socket ${socket.id} disconnected`);
                
                if (userSocketMap[userId].size === 0) {
                    delete userSocketMap[userId];
                    console.log(`[Socket] User ${userId} is now fully offline`);
                }
            }
        });
    });

    return io;
};

export const getIo = () => {
    if (!io) throw new Error("Socket.io not initialized");
    return io;
};

export const sendSocketNotification = (recipientId, event, data) => {
    const socketIds = userSocketMap[recipientId?.toString()];
    if (socketIds && socketIds.size > 0) {
        console.log(`[Socket] Emitting to ${socketIds.size} sockets for user ${recipientId}`);
        socketIds.forEach(socketId => {
            getIo().to(socketId).emit(event, data);
        });
        console.log(`[Socket] Notification sent to user ${recipientId}`);
    } else {
        console.log(`[Socket] User ${recipientId} is offline – no socket emission`);
    }
};
