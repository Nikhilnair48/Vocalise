import express from 'express';
import { getChatRooms, getMessagesForRoom } from '../controllers/chatController.js';

const router = express.Router();

// Get available chat rooms
router.get('/chatrooms', getChatRooms);

// Get previous messages for a specific chatroom
router.get('/messages/:roomId', getMessagesForRoom);

export default router;
