
import { ChatUser } from "@/types/chat";
import { getUser } from "@/utils/auth";
import { MOCK_USERS } from "./types";

// Get current user from auth
export const getCurrentChatUser = (): ChatUser | null => {
  const currentUser = getUser();
  if (!currentUser) return null;
  
  // Convert auth user to chat user
  return {
    id: currentUser.id || "",
    name: currentUser.name || currentUser.email.split("@")[0],
    email: currentUser.email,
    userType: currentUser.userType,
    organization: currentUser.organization,
    profilePicture: currentUser.profilePicture || "/placeholder.svg",
    isOnline: true,
    lastActive: new Date()
  };
};

// Get all users available for chat (filtered by user type if needed)
export const getAvailableChatUsers = (
  userType?: "donor" | "ngo" | "recipient"
): ChatUser[] => {
  const currentUser = getCurrentChatUser();
  if (!currentUser) return [];

  // Filter out current user and filter by type if specified
  return MOCK_USERS.filter(
    (user) => 
      user.id !== currentUser.id && 
      (!userType || user.userType === userType)
  );
};
