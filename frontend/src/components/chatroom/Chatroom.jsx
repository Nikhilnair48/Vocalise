import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

export const Chatroom = ({ userId }) => {
  const { id: room } = useParams();
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!socket) {
      const newSocket = io("http://localhost:3000/chat");
      setSocket(newSocket);

      newSocket.emit("join_room", { userId, room });

      newSocket.on("receive_message", (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      newSocket.on("user_joined", (data) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { username: "System", text: `${data.username} joined the chat` },
        ]);
      });

      return () => {
        newSocket.emit("leave_room", { userId, room });
        newSocket.disconnect();
      };
    }
  }, [socket, userId, room]);

  const sendMessage = () => {
    if (message.trim() === "") return;
    socket.emit("send_message", { userId, username: "You", room, message });
    setMessages([...messages, { username: "You", text: message }]);
    setMessage("");
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.username}: </strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Submit</button>
    </div>
  );
};
