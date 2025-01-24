import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('DB Connection Error:', error);
    process.exit(1);
  }
};

export default connectDB;