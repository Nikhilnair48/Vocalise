import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../../contexts/SocketContext";

export const Chatroom = ({ userId, username }) => {
  const { id: roomParam } = useParams();
  const room = roomParam || "default"; // Fallback to 'default' if no room param
  const [messages, setMessages] = useState([]);
  const socket = useSocket();
  const [message, setMessage] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchMessages = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/chat/messages/${room}`);
      if (!response.ok) {
        throw new Error(`Error fetching messages: ${response.statusText}`);
      }
      const data = await response.json();
      setMessages(
        data.map((msg) => ({
          userId: msg.userId,
          username: msg.username === username ? "You" : msg.username,
          text: msg.message,
          timestamp: msg.timestamp,
        }))
      );
      console.log("Fetched messages:", data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    if (socket && userId && username) {
      // Re-emit 'join_room' to ensure the user is in the room
      socket.emit("join_room", { userId, username, room });
      console.log(`Emitted 'join_room' for user ${username} in room ${room}.`);

      // Listen for incoming messages
      socket.on("receive_message", handleReceiveMessage);
      socket.on("user_joined", handleUserJoined);
      socket.on("user_left", handleUserLeft);

      // Fetch previous messages from the server
      fetchMessages();

      // Cleanup on unmount
      return () => {
        socket.off("receive_message", handleReceiveMessage);
        socket.off("user_joined", handleUserJoined);
        socket.off("user_left", handleUserLeft);
      };
    }
  }, [socket, userId, username, room, fetchMessages]);

  const handleReceiveMessage = (data) => {
    console.log("Received message:", data);
    setMessages((prevMessages) => [...prevMessages, data]);
  };

  const handleUserJoined = (data) => {
    console.log("User joined:", data.username);
    setMessages((prevMessages) => [
      ...prevMessages,
      { username: "System", text: `${data.username} joined the chat` },
    ]);
  };

  const handleUserLeft = (data) => {
    console.log("User left:", data.username);
    setMessages((prevMessages) => [
      ...prevMessages,
      { username: "System", text: `${data.username} left the chat` },
    ]);
  };

  const sendMessage = () => {
    if (message.trim() === "") return;
    if (socket) {
      const msgData = { userId, username, room, message };
      console.log("Sending message:", msgData);
      socket.emit("send_message", msgData);
      setMessages((prevMessages) => [
        ...prevMessages,
        { userId, username: "You", text: message },
      ]);
      setMessage("");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Chat Room: {room}</h2>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "400px",
          overflowY: "scroll",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: "5px",
              textAlign: msg.username === "You" ? "right" : "left",
            }}
          >
            <strong>{msg.username}: </strong> {msg.text}
          </div>
        ))}
      </div>
      <div style={{ display: "flex" }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: 1, padding: "10px" }}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!message.trim()}
          style={{ padding: "10px 20px", marginLeft: "10px" }}
        >
          Send
        </button>
      </div>
    </div>
  );
};
