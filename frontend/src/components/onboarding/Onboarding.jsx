import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../contexts/SocketContext";
import "./index.css";
import { v4 as uuidv4 } from "uuid";

export const Onboarding = ({ setUserId, setUserName }) => {
  const [username, setUsername] = useState("");
  const socket = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
      setUserName(localStorage.getItem("username"));
      navigate("/chatrooms");
    }
  }, [navigate, setUserId, setUserName]);

  useEffect(() => {
    if (socket) {
      // Listen for messages from the server
      socket.on("message", handleServerMessage);
      socket.on("connect_error", handleConnectError);

      return () => {
        socket.off("message", handleServerMessage);
        socket.off("connect_error", handleConnectError);
      };
    }
  }, [socket]);

  const handleServerMessage = (data) => {
    if (data.text.startsWith("Welcome to the chat room")) {
      const userId = localStorage.getItem("userId");
      setUserId(userId);
      setUserName(localStorage.getItem("username"));
      navigate("/chatrooms");
      socket.off("message", handleServerMessage);
    }
  };

  const handleConnectError = (err) => {
    console.error("Connection Error:", err);
  };

  const handleJoinChat = () => {
    if (socket) {
      // Generate a new userId if not already set
      let userId = localStorage.getItem("userId");
      if (!userId) {
        userId = uuidv4();
        localStorage.setItem("userId", userId);
        localStorage.setItem("username", username);
      }

      // Emit join_room event only once
      socket.emit("join_room", { userId, username, room: "default" });
      console.log(`Emitted 'join_room' for user ${username} in room 'default'.`);
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-content">
        <h2>Welcome to Vocalise!</h2>
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleJoinChat} disabled={!username}>
            Join Chat
          </button>
        </div>
      </div>
    </div>
  );
};
