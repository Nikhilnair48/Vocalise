import { Server } from "socket.io";
import { joinRoom, sendMessage } from "../controllers/chatController.js";

export const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  const chatNamespace = io.of("/chat");

  chatNamespace.on("connection", (socket) => {
    console.log("a user connected:", socket.id);

    socket.on("join_room", (data) => joinRoom(socket, data));
    socket.on("send_message", (data) => sendMessage(io, socket, data));

    socket.on("disconnect", () => {
      console.log("user disconnected:", socket.id);
      // TODO: Handle disconnection logic
    });
  });

  console.log("Socket.io initialized");
};
