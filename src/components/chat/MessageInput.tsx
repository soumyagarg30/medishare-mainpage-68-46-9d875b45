
import React, { useState, useRef } from "react";
import { Send, Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatAttachment } from "@/types/chat";

interface MessageInputProps {
  onSendMessage: (message: string, attachments?: ChatAttachment[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

const MessageInput = ({
  onSendMessage,
  placeholder = "Type a message...",
  disabled = false,
}: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() !== "" || attachments.length > 0) {
      onSendMessage(message.trim(), attachments.length > 0 ? attachments : undefined);
      setMessage("");
      setAttachments([]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // Convert FileList to array and create mock attachments
    const newAttachments: ChatAttachment[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Determine file type
      const fileType = file.type.startsWith("image/")
        ? "image"
        : file.type.includes("pdf") || file.type.includes("document")
        ? "document"
        : "other";
      
      // Create mock URL - in a real app, this would be a server upload
      const mockUrl = URL.createObjectURL(file);
      
      newAttachments.push({
        id: `attachment-${Date.now()}-${i}`,
        type: fileType,
        url: mockUrl,
        name: file.name,
        size: file.size,
      });
    }
    
    setAttachments([...attachments, ...newAttachments]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter((att) => att.id !== id));
  };
  
  return (
    <form onSubmit={handleSubmit} className="p-3 border-t">
      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center bg-gray-100 rounded px-2 py-1"
            >
              <span className="text-xs truncate max-w-[100px]">
                {attachment.name}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 ml-1"
                onClick={() => removeAttachment(attachment.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
        >
          <Paperclip className="h-5 w-5 text-gray-500" />
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled}
        />
        
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholder}
            className="w-full border rounded-full resize-none py-2 px-4 focus:outline-none focus:border-medishare-blue min-h-[40px] max-h-[120px] overflow-auto"
            disabled={disabled}
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
        </div>
        
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className={`h-9 w-9 rounded-full ${
            message.trim() !== "" || attachments.length > 0
              ? "bg-medishare-blue text-white hover:bg-medishare-blue/90"
              : ""
          }`}
          disabled={disabled || (message.trim() === "" && attachments.length === 0)}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};

export default MessageInput;
