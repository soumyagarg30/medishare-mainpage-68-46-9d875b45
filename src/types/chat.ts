
export interface ChatUser {
  id: string;
  name: string;
  email: string;
  userType: "donor" | "ngo" | "recipient" | "admin";
  organization?: string;
  profilePicture?: string;
  isOnline?: boolean;
  lastActive?: Date;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  attachments?: ChatAttachment[];
}

export interface ChatAttachment {
  id: string;
  type: "image" | "document" | "other";
  url: string;
  name: string;
  size: number;
}

export interface ChatConversation {
  id: string;
  participants: ChatUser[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  lastActivity: Date;
  isActive: boolean;
}
