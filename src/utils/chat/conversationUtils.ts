
import { ChatConversation, ChatMessage, ChatUser, ChatAttachment } from "@/types/chat";
import { getCurrentChatUser } from "./userUtils";
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from "./types";

// Get conversations for current user
export const getUserConversations = (): ChatConversation[] => {
  const currentUser = getCurrentChatUser();
  if (!currentUser) return [];

  // Return conversations where current user is a participant
  return MOCK_CONVERSATIONS.filter((conversation) =>
    conversation.participants.some((p) => p.id === currentUser.id)
  );
};

// Get messages for a specific conversation
export const getConversationMessages = (
  conversationId: string
): ChatMessage[] => {
  return MOCK_MESSAGES[conversationId] || [];
};

// Create a new message
export const sendChatMessage = (
  conversationId: string,
  content: string,
  attachments?: ChatAttachment[]
): Promise<ChatMessage> => {
  return new Promise((resolve) => {
    const currentUser = getCurrentChatUser();
    if (!currentUser) throw new Error("User not authenticated");

    const conversation = MOCK_CONVERSATIONS.find((c) => c.id === conversationId);
    if (!conversation) throw new Error("Conversation not found");

    const receiver = conversation.participants.find(
      (p) => p.id !== currentUser.id
    );
    if (!receiver) throw new Error("Receiver not found");

    // Create new message
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      receiverId: receiver.id,
      content,
      timestamp: new Date(),
      isRead: false,
      attachments,
    };

    // Add to mock storage
    if (!MOCK_MESSAGES[conversationId]) {
      MOCK_MESSAGES[conversationId] = [];
    }
    MOCK_MESSAGES[conversationId].push(newMessage);

    // Update conversation last activity and last message
    conversation.lastActivity = new Date();
    conversation.lastMessage = newMessage;

    // Simulate network delay
    setTimeout(() => {
      resolve(newMessage);
    }, 500);
  });
};

// Mark messages as read
export const markMessagesAsRead = (
  conversationId: string
): Promise<boolean> => {
  return new Promise((resolve) => {
    const currentUser = getCurrentChatUser();
    if (!currentUser) throw new Error("User not authenticated");

    const messages = MOCK_MESSAGES[conversationId] || [];
    
    // Mark messages sent to current user as read
    messages.forEach((message) => {
      if (message.receiverId === currentUser.id) {
        message.isRead = true;
      }
    });

    // Update unread count in conversation
    const conversation = MOCK_CONVERSATIONS.find((c) => c.id === conversationId);
    if (conversation) {
      conversation.unreadCount = 0;
    }

    // Simulate network delay
    setTimeout(() => {
      resolve(true);
    }, 300);
  });
};

// Create a new conversation with a user
export const createConversation = (
  otherUserId: string
): Promise<ChatConversation> => {
  return new Promise((resolve) => {
    const currentUser = getCurrentChatUser();
    if (!currentUser) throw new Error("User not authenticated");

    const otherUser = MOCK_USERS.find((u) => u.id === otherUserId);
    if (!otherUser) throw new Error("User not found");

    // Check if conversation already exists
    const existingConvo = MOCK_CONVERSATIONS.find(
      (c) =>
        c.participants.some((p) => p.id === currentUser.id) &&
        c.participants.some((p) => p.id === otherUserId)
    );

    if (existingConvo) {
      resolve(existingConvo);
      return;
    }

    // Create new conversation
    const newConversation: ChatConversation = {
      id: `conv-${Date.now()}`,
      participants: [currentUser, otherUser],
      unreadCount: 0,
      lastActivity: new Date(),
      isActive: true,
    };

    // Add to mock storage
    MOCK_CONVERSATIONS.push(newConversation);
    MOCK_MESSAGES[newConversation.id] = [];

    // Simulate network delay
    setTimeout(() => {
      resolve(newConversation);
    }, 500);
  });
};
