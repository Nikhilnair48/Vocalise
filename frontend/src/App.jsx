import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Onboarding } from "./components/onboarding/Onboarding";
import { Chatroom } from "./components/chatroom/Chatroom";

function App() {
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [userName, setUserName] = useState(localStorage.getItem("username") || null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Onboarding setUserId={setUserId} setUserName={setUserName} />} />
        <Route path="/chatrooms" element={<Chatroom userId={userId} username={userName} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;