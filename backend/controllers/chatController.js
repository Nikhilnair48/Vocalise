import User from "../models/userModel.js";
import Message from '../models/messageModel.js';
import ChatRooms from '../models/chatroomsModel.js';

export async function joinRoom(socket, data) {
  const { userId, username, room } = data;
  socket.join(room);

  try {
    // Store user details in MongoDB only if they are not already present
    const existingUser = await User.findOne({ userId });
    if (!existingUser) {
      await User.create({ userId, name: username, socketId: socket.id, room });
      // Emit 'user_joined' only if the user is newly joining
      socket.to(room).emit("user_joined", { username });
      socket.emit("message", {
        username: "System",
        text: `Welcome to the chat room, ${username}!`,
        userId: userId,
      });
    } else {
      console.log(`User ${username} is already in room ${room}.`);
    }
  } catch (error) {
    console.error("Error joining room:", error);
    socket.emit("error", { message: "Failed to join room" });
  }
}

export async function leaveRoom(socket, data) {
  const { userId, room } = data;
  socket.leave(room);

  try {
    const user = await User.findOne({ userId });
    if (user) {
      await User.findOneAndDelete({ userId });
      socket.to(room).emit("user_left", { username: user.name });
    }

    socket.emit("message", {
      username: "System",
      text: `You have left the chat room.`,
      userId: userId,
    });
  } catch (error) {
    console.error("Error leaving room:", error);
  }
}

export async function sendMessage(io, data) {
  console.log("sendMessage function called with data:", data);
  const { userId, username, room, message } = data;

  const newMessage = new Message({
    userId,
    username,
    room,
    message,
    timestamp: new Date(),
  });
  console.log("Saving message to DB:", newMessage);

  try {
    await newMessage.save();
    console.log("Message saved to DB.");

    io.to(room).emit("receive_message", {
      userId,
      username,
      text: message,
      timestamp: newMessage.timestamp,
    });
    console.log(`Emitted 'receive_message' to room ${room}.`);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}


// Fetch available chat rooms
export const getChatRooms = async (req, res) => {
  try {
    const rooms = await ChatRooms.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching chat rooms" });
  }
};



// Fetch messages for a specific room
export const getMessagesForRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await Message.find({ room: roomId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages" });
  }
};
