import User from "../models/userModel.js";
import Message from '../models/messageModel.js';
import ChatRooms from '../models/chatroomsModel.js';

export async function joinRoom(socket, data) {
  const { username, room } = data;
  console.log(username);
  socket.join(room);

  try {
    const existingUser = await User.findOne({ name: username });
    if (existingUser) {
      return socket.emit("error", {
        message: "Username already exists. Please choose another.",
      });
    }

    const user = await User.create({ userId: username, name: username, socketId: socket.id });
    socket.to(room).emit("user_joined", { username });

    socket.emit("message", {
      username: "System",
      text: `Welcome to the chat room, ${username}!`,
      userId: user._id,
    });
  } catch (error) {
    console.error("Error joining room:", error);
    socket.emit("error", { message: "Failed to join room" });
  }
}

export async function sendMessage(io, socket, data) {
    const { room, ...messageData } = data;
    // Store message in MongoDB
  
    // Broadcast message to all users in the room
    io.to(room).emit("message", messageData);
};

// Fetch available chat rooms
export const getChatRooms = async (req, res) => {
  try {
    const rooms = await ChatRooms.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chat rooms' });
  }
};

// Fetch messages for a specific room
export const getMessagesForRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await Message.find({ room: roomId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
};
