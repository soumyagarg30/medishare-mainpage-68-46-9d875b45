
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatroomLayout from "@/components/chat/ChatroomLayout";
import { isAuthenticated } from "@/utils/auth";
import { Navigate } from "react-router-dom";

const Chat = () => {
  // Check if user is authenticated
  const authenticated = isAuthenticated();

  if (!authenticated) {
    return <Navigate to="/sign-in" state={{ from: "/chat" }} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 mt-20">
        <ChatroomLayout />
      </div>
      <Footer />
    </div>
  );
};

export default Chat;
