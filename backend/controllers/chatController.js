import User from "../models/userModel.js";
import Message from '../models/messageModel.js';

export async function joinRoom(socket, data) {
  const { userId, username, room } = data;
  socket.join(room);

  try {
    // Store user details in MongoDB only if they are not already present
    const existingUser = await User.findOne({ userId });
    if (!existingUser) {
      await User.create({ userId, name: username, socketId: socket.id, room });
    }

    socket.to(room).emit("user_joined", { username });
    socket.emit("message", {
      username: "System",
      text: `Welcome to the chat room, ${username}!`,
      userId: userId,
    });
  } catch (error) {
    console.error("Error joining room:", error);
    socket.emit("error", { message: "Failed to join room" });
  }
}

export async function leaveRoom(socket, data) {
  const { userId, room } = data;
  socket.leave(room);

  try {
    await User.findOneAndDelete({ userId });

    socket.to(room).emit("message", {
      type: "system",
      text: `User has left the room.`,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Error leaving room:", error);
  }
}

export async function sendMessage(io, data) {
  const { userId, room, text } = data;

  const message = new Message({
    userId,
    room,
    message: text,
    timestamp: new Date(),
  });

  try {
    await message.save();
    io.to(room).emit("receive_message", { userId, text, timestamp: new Date() });
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

