import { useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import "./index.css";

const socket = io.connect("http://localhost:3000/chat");

export const Onboarding = ({ setUserId }) => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleJoinChat = () => {
    socket.emit("join_room", { username, room: "default" });

    socket.on("message", (data) => {
      if (data.text.startsWith("Welcome to the chat room")) {
        setUserId(data.userId);
        navigate("/chatrooms");
      }
    });
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