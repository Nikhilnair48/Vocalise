import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Onboarding } from "./components/onboarding/Onboarding";
import { Chatrooms } from "./components/chatrooms/Chatrooms";
import { Chatroom } from "./components/chatroom/Chatroom";

function App() {
  const [userId, setUserId] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Onboarding setUserId={setUserId} />} />
        <Route path="/chatrooms" element={<Chatrooms userId={userId} />} />
        <Route
          path="/chatrooms/:id"
          element={<Chatroom userId={userId} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;