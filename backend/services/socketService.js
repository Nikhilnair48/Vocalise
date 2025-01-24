import { Server } from "socket.io";
import { joinRoom, sendMessage, leaveRoom } from "../controllers/chatController.js";

const activeUsers = new Map();

export const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173", // Ensure this matches your client's origin
      methods: ["GET", "POST"],
    },
  });

  const chatNamespace = io.of("/chat");

  chatNamespace.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_room", async (data) => {
      console.log("join_room event received with data:", data);
      await joinRoom(socket, data);
      activeUsers.set(socket.id, { userId: data.userId, room: data.room });
    });

    socket.on("send_message", async (data) => {
      console.log("send_message event received with data:", data);
      await sendMessage(io, data);
    });

    socket.on("leave_room", async (data) => {
      console.log("leave_room event received with data:", data);
      await leaveRoom(socket, data);
      activeUsers.delete(socket.id);
    });

    socket.on("disconnect", async () => {
      console.log("User disconnected:", socket.id);
      const userData = activeUsers.get(socket.id);
      if (userData) {
        await leaveRoom(socket, userData);
        activeUsers.delete(socket.id);
      }
    });
  });
};
