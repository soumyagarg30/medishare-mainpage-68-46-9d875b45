
import { ChatUser, ChatMessage, ChatConversation } from "@/types/chat";
import { getUser, UserData } from "@/utils/auth";

// Mock data for development - will be replaced with actual API calls
const MOCK_USERS: ChatUser[] = [
  {
    id: "donor-1",
    name: "Apollo Hospitals",
    email: "contact@apollo.com",
    userType: "donor",
    organization: "Apollo Hospitals",
    profilePicture: "/placeholder.svg",
    isOnline: true,
    lastActive: new Date()
  },
  {
    id: "ngo-1",
    name: "Uday Foundation",
    email: "info@udayfoundation.org",
    userType: "ngo",
    organization: "Uday Foundation",
    profilePicture: "/placeholder.svg",
    isOnline: false,
    lastActive: new Date(Date.now() - 1000 * 60 * 15) // 15 minutes ago
  },
  {
    id: "ngo-2",
    name: "SERUDS India",
    email: "contact@seruds.org",
    userType: "ngo",
    organization: "SERUDS India",
    profilePicture: "/placeholder.svg",
    isOnline: true,
    lastActive: new Date()
  },
  {
    id: "donor-2",
    name: "Max Healthcare",
    email: "info@maxhealthcare.in",
    userType: "donor",
    organization: "Max Healthcare",
    profilePicture: "/placeholder.svg",
    isOnline: true,
    lastActive: new Date()
  }
];

const MOCK_CONVERSATIONS: ChatConversation[] = [
  {
    id: "conv-1",
    participants: [MOCK_USERS[0], MOCK_USERS[1]],
    unreadCount: 2,
    lastActivity: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    isActive: true
  },
  {
    id: "conv-2",
    participants: [MOCK_USERS[0], MOCK_USERS[2]],
    unreadCount: 0,
    lastActivity: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    isActive: true
  },
  {
    id: "conv-3",
    participants: [MOCK_USERS[3], MOCK_USERS[1]],
    unreadCount: 1,
    lastActivity: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    isActive: true
  }
];

const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  "conv-1": [
    {
      id: "msg-1",
      senderId: "donor-1",
      receiverId: "ngo-1",
      content: "Hello, we have some surplus antibiotics available. Would your organization be interested?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      isRead: true
    },
    {
      id: "msg-2",
      senderId: "ngo-1",
      receiverId: "donor-1",
      content: "Yes, we are in need of antibiotics. Could you share more details about the quantity and expiry dates?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23), // 23 hours ago
      isRead: true
    },
    {
      id: "msg-3",
      senderId: "donor-1",
      receiverId: "ngo-1",
      content: "We have approximately 500 boxes of Amoxicillin, expiring in 6 months. Would that be helpful?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22), // 22 hours ago
      isRead: true
    },
    {
      id: "msg-4",
      senderId: "ngo-1",
      receiverId: "donor-1",
      content: "That would be perfect! When can we arrange for pickup?",
      timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
      isRead: false
    },
    {
      id: "msg-5",
      senderId: "ngo-1",
      receiverId: "donor-1",
      content: "Also, do you have any other medications available?",
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      isRead: false
    }
  ],
  "conv-2": [
    {
      id: "msg-6",
      senderId: "donor-1",
      receiverId: "ngo-2",
      content: "Hi SERUDS, we have some medical equipment we'd like to donate. Are you accepting such donations?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      isRead: true
    },
    {
      id: "msg-7",
      senderId: "ngo-2",
      receiverId: "donor-1",
      content: "Hello Apollo Hospitals! Yes, we're currently accepting medical equipment donations. What kind of equipment do you have?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      isRead: true
    }
  ],
  "conv-3": [
    {
      id: "msg-8",
      senderId: "donor-2",
      receiverId: "ngo-1",
      content: "Greetings! We have surplus diabetes medications. Would your organization need them?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      isRead: true
    },
    {
      id: "msg-9",
      senderId: "ngo-1",
      receiverId: "donor-2",
      content: "Hello Max Healthcare! That would be very helpful. What type of diabetes medications do you have?",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      isRead: false
    }
  ]
};

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
