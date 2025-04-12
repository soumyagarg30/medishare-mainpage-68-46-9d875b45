
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { ChatConversation } from "@/types/chat";
import UserAvatar from "@/components/chat/UserAvatar";

interface ConversationItemProps {
  conversation: ChatConversation;
  currentUserId: string;
  isActive: boolean;
  onClick: () => void;
}

const ConversationItem = ({ 
  conversation, 
  currentUserId, 
  isActive,
  onClick 
}: ConversationItemProps) => {
  // Get the other participant (not the current user)
  const otherParticipant = conversation.participants.find(p => p.id !== currentUserId);
  
  if (!otherParticipant) return null;
  
  // Format the last activity time
  const lastActivityTime = formatDistanceToNow(new Date(conversation.lastActivity), {
    addSuffix: true,
  });
  
  return (
    <div 
      className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg transition-colors ${
        isActive ? "bg-medishare-blue/10" : "hover:bg-gray-100"
      }`}
      onClick={onClick}
    >
      <UserAvatar user={otherParticipant} />
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="font-medium truncate">{otherParticipant.name}</h3>
          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
            {lastActivityTime}
          </span>
        </div>
        
        <div className="flex justify-between items-center mt-1">
          <p className="text-sm text-gray-600 truncate">
            {conversation.lastMessage?.content || "Start a conversation..."}
          </p>
          
          {conversation.unreadCount > 0 && (
            <span className="ml-2 bg-medishare-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
