import express from "express";
import cors from "cors";
import { config } from "dotenv";
import connectDB from "./utils/db.js";
import chatRoutes from "./routes/chatRoutes.js";
import { initializeSocket } from "./services/socketService.js";

config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to DB
connectDB();

// Routes
app.use("/api/chat", chatRoutes);

// Start HTTP and WebSocket Server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
initializeSocket(server);
