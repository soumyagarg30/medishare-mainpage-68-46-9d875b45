
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChatUser, ChatConversation, ChatMessage } from "@/types/chat";
import { 
  getCurrentChatUser, 
  getUserConversations, 
  getConversationMessages, 
  sendChatMessage,
  markMessagesAsRead,
  getAvailableChatUsers,
  createConversation
} from "@/utils/chatService";

import ConversationItem from "./ConversationItem";
import MessageItem from "./MessageItem";
import MessageInput from "./MessageInput";
import ConversationHeader from "./ConversationHeader";
import UserAvatar from "./UserAvatar";
import { isAuthenticated } from "@/utils/auth";

const ChatroomLayout = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<ChatUser | null>(null);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<ChatUser[]>([]);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const isLoggedIn = await isAuthenticated();
      if (!isLoggedIn) {
        navigate("/sign-in", { state: { from: "/chat" } });
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  // Initialize chat data
  useEffect(() => {
    const initializeChat = () => {
      try {
        const user = getCurrentChatUser();
        if (!user) {
          navigate("/sign-in", { state: { from: "/chat" } });
          return;
        }
        
        setCurrentUser(user);
        
        // Get user conversations
        const userConversations = getUserConversations();
        setConversations(userConversations);
        
        // Select the first conversation if available
        if (userConversations.length > 0) {
          setSelectedConversation(userConversations[0]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error initializing chat:", error);
        setLoading(false);
      }
    };
    
    initializeChat();
  }, [navigate]);
  
  // Load messages when selected conversation changes
  useEffect(() => {
    if (selectedConversation) {
      // Set mobile view to chat when conversation is selected
      setMobileView("chat");
      
      // Get messages for the selected conversation
      const conversationMessages = getConversationMessages(selectedConversation.id);
      setMessages(conversationMessages);
      
      // Mark messages as read
      markMessagesAsRead(selectedConversation.id)
        .then(() => {
          // Update conversations to reflect read status
          setConversations(conversations.map(c => 
            c.id === selectedConversation.id ? { ...c, unreadCount: 0 } : c
          ));
        })
        .catch(error => {
          console.error("Error marking messages as read:", error);
        });
    }
  }, [selectedConversation, conversations]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Handle send message
  const handleSendMessage = async (text: string, attachments?: any[]) => {
    if (!selectedConversation || !currentUser) return;
    
    try {
      setSendingMessage(true);
      
      // Send the message
      const newMessage = await sendChatMessage(
        selectedConversation.id,
        text,
        attachments
      );
      
      // Update messages
      setMessages([...messages, newMessage]);
      
      // Update conversations
      setConversations(
        conversations.map(c =>
          c.id === selectedConversation.id
            ? {
                ...c,
                lastActivity: new Date(),
                lastMessage: newMessage
              }
            : c
        )
      );
      
      setSendingMessage(false);
    } catch (error) {
      console.error("Error sending message:", error);
      setSendingMessage(false);
    }
  };
  
  // Handle conversation selection
  const handleSelectConversation = (conversation: ChatConversation) => {
    setSelectedConversation(conversation);
  };
  
  // Handle new chat dialog
  const handleOpenNewChat = () => {
    const users = getAvailableChatUsers();
    setAvailableUsers(users);
    setShowNewChatDialog(true);
  };
  
  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conversation => {
    const otherParticipant = conversation.participants.find(
      p => p.id !== (currentUser?.id || "")
    );
    
    if (!otherParticipant) return false;
    
    return otherParticipant.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) ||
      (otherParticipant.organization || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
  });
  
  // Handle starting a new conversation
  const handleStartConversation = async (otherUser: ChatUser) => {
    try {
      // Create new conversation
      const newConversation = await createConversation(otherUser.id);
      
      // Add to conversations list
      setConversations([newConversation, ...conversations]);
      
      // Select the new conversation
      setSelectedConversation(newConversation);
      
      // Close dialog
      setShowNewChatDialog(false);
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };
  
  // Get the other participant in the selected conversation
  const getOtherParticipant = () => {
    if (!selectedConversation || !currentUser) return null;
    
    return selectedConversation.participants.find(
      p => p.id !== currentUser.id
    );
  };
  
  // Go back to conversation list on mobile
  const handleBackToList = () => {
    setMobileView("list");
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col h-screen max-w-6xl mx-auto">
        <div className="p-4 border-b">
          <Skeleton className="h-8 w-40" />
        </div>
        <div className="flex flex-1">
          <div className="w-1/3 border-r p-3 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
          <div className="flex-1 p-4 flex flex-col">
            <Skeleton className="h-12 w-full mb-4" />
            <div className="flex-1 space-y-4">
              <div className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-20 w-2/3 rounded-lg" />
              </div>
              <div className="flex items-start justify-end gap-3">
                <Skeleton className="h-16 w-2/3 rounded-lg" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-16 w-full mt-4" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">Not Authenticated</h2>
        <p className="mb-6">Please sign in to access the chat feature.</p>
        <Button onClick={() => navigate("/sign-in")}>Sign In</Button>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-6xl mx-auto">
      <div className="bg-medishare-blue text-white p-4">
        <h1 className="text-xl font-bold">Medishare Chat</h1>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Conversations List */}
        <div 
          className={`border-r w-full md:w-1/3 flex flex-col ${
            mobileView === "chat" ? "hidden md:flex" : "flex"
          }`}
        >
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Search conversations" 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="p-3 border-b">
            <Button 
              onClick={handleOpenNewChat}
              className="w-full bg-medishare-blue hover:bg-medishare-blue/90"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              New Conversation
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <p className="text-gray-500 mb-4">No conversations found</p>
                <Button 
                  variant="outline" 
                  onClick={handleOpenNewChat}
                >
                  Start a new conversation
                </Button>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  currentUserId={currentUser.id}
                  isActive={selectedConversation?.id === conversation.id}
                  onClick={() => handleSelectConversation(conversation)}
                />
              ))
            )}
          </div>
        </div>
        
        {/* Chat Area */}
        <div 
          className={`flex-1 flex flex-col ${
            mobileView === "list" ? "hidden md:flex" : "flex"
          }`}
        >
          {selectedConversation && getOtherParticipant() ? (
            <>
              <ConversationHeader 
                user={getOtherParticipant()!} 
                onBackClick={handleBackToList}
                showBackButton={true}
              />
              
              <div className="flex-1 overflow-y-auto p-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <p className="text-gray-500">No messages yet</p>
                    <p className="text-sm text-gray-400">Send a message to start the conversation</p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isCurrentUser = message.senderId === currentUser.id;
                    const sender = selectedConversation.participants.find(
                      p => p.id === message.senderId
                    )!;
                    
                    return (
                      <MessageItem
                        key={message.id}
                        message={message}
                        sender={sender}
                        isCurrentUser={isCurrentUser}
                      />
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <MessageInput 
                onSendMessage={handleSendMessage}
                disabled={sendingMessage}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-4">
              <p className="text-xl font-medium mb-2">Select a conversation</p>
              <p className="text-gray-500 text-center mb-4">
                Choose an existing conversation or start a new one
              </p>
              <Button 
                variant="outline" 
                onClick={handleOpenNewChat}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                New Conversation
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* New Chat Dialog */}
      <Dialog open={showNewChatDialog} onOpenChange={setShowNewChatDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start a new conversation</DialogTitle>
          </DialogHeader>
          
          <Input
            placeholder="Search users"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4"
          />
          
          <div className="max-h-[300px] overflow-y-auto">
            {availableUsers
              .filter(user => 
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (user.organization || "").toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
                  onClick={() => handleStartConversation(user)}
                >
                  <UserAvatar user={user} showStatus />
                  
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-xs text-gray-500">
                      {user.userType === "ngo" ? "NGO" : "Donor"} • {user.organization}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatroomLayout;
