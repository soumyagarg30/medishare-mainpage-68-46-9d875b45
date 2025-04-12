
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { ChatMessage, ChatUser } from "@/types/chat";
import UserAvatar from "@/components/chat/UserAvatar";

interface MessageItemProps {
  message: ChatMessage;
  sender: ChatUser;
  isCurrentUser: boolean;
}

const MessageItem = ({ message, sender, isCurrentUser }: MessageItemProps) => {
  const timestamp = formatDistanceToNow(new Date(message.timestamp), {
    addSuffix: true,
  });
  
  return (
    <div className={`flex gap-3 mb-4 ${isCurrentUser ? "flex-row-reverse" : ""}`}>
      {!isCurrentUser && <UserAvatar user={sender} showStatus={false} size="sm" />}
      
      <div className={`max-w-[70%] ${isCurrentUser ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-lg p-3 break-words ${
            isCurrentUser
              ? "bg-medishare-blue text-white rounded-br-none"
              : "bg-gray-100 text-gray-800 rounded-bl-none"
          }`}
        >
          {message.content}
          
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-1">
              {message.attachments.map((attachment) => (
                <div key={attachment.id} className="flex items-center gap-1">
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs underline hover:no-underline"
                  >
                    {attachment.name}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className={`text-xs text-gray-500 mt-1 flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
          {timestamp}
          {isCurrentUser && (
            <span className="ml-1">
              {message.isRead ? "• Read" : ""}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
