
import { ChatUser, ChatMessage, ChatConversation, ChatAttachment } from "@/types/chat";

// Mock data for development - will be replaced with actual API calls
export const MOCK_USERS: ChatUser[] = [
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

export const MOCK_CONVERSATIONS: ChatConversation[] = [
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

export const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
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
