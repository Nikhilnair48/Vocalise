import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import "./index.css";
import { v4 as uuidv4 } from 'uuid';

export const Onboarding = ({ setUserId }) => {
  const [username, setUsername] = useState("");
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
      navigate("/chatrooms");
    }
  }, [navigate, setUserId]);

  const handleJoinChat = () => {
    if (!socket) {
      const newSocket = io.connect("http://localhost:3000/chat");
      setSocket(newSocket);

      // Generate a new userId if not already set
      let userId = localStorage.getItem("userId");
      if (!userId) {
        userId = uuidv4();
        localStorage.setItem("userId", userId);
      }

      newSocket.on("message", (data) => {
        if (data.text.startsWith("Welcome to the chat room")) {
          setUserId(userId);
          navigate("/chatrooms");
          newSocket.off("message");
        }
      });

      // Send userId along with username to backend
      newSocket.emit("join_room", { userId, username, room: "default" });
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
