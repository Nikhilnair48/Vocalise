import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  room: { type: String, required: true },
  userId: { type: String, required: true },
  username: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Message', messageSchema);