import React, { useState } from "react";
import LoginPage from "./pages/LoginPage";
import { useAuth } from "./hooks/useAuth";
import ChatPage from "./pages/ChatPage";
import { Toaster } from "react-hot-toast";
import RegisterPage from "./pages/RegisterPage";

const App = () => {
  const { user } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      {user ? (
        <ChatPage />
      ) : showRegister ? (
        <RegisterPage onBack={() => setShowRegister(false)} />
      ) : (
        <LoginPage onRegister={() => setShowRegister(true)} />
      )}
      <Toaster position="top-right" />
    </>
  );
};

export default App;
