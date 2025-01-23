import { createContext, useState } from "react";

export const ChatContext = createContext();

// eslint-disable-next-line react/prop-types
export const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);

  return (
    <ChatContext.Provider value={{ user, setUser, room, setRoom, messages, setMessages }}>
      {children}
    </ChatContext.Provider>
  );
};
