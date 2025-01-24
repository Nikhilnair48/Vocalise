import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  socketId: { type: String, required: true },
  room: { type: String, required: false },
  joinedAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);