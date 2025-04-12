
import React from "react";
import { ChatUser } from "@/types/chat";
import { ArrowLeft, Phone, Video, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import UserAvatar from "@/components/chat/UserAvatar";

interface ConversationHeaderProps {
  user: ChatUser;
  onBackClick?: () => void;
  showBackButton?: boolean;
}

const ConversationHeader = ({ 
  user, 
  onBackClick,
  showBackButton = false
}: ConversationHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-3 border-b">
      <div className="flex items-center gap-3">
        {showBackButton && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={onBackClick}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        
        <UserAvatar user={user} />
        
        <div>
          <h2 className="font-medium">{user.name}</h2>
          <p className="text-xs text-gray-500">
            {user.userType === "ngo" ? "NGO" : "Donor"} • {user.organization}
          </p>
          <p className="text-xs text-gray-500">
            {user.isOnline ? "Online" : "Last active recently"}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Phone className="h-5 w-5 text-medishare-blue" />
        </Button>
        
        <Button variant="ghost" size="icon" className="rounded-full">
          <Video className="h-5 w-5 text-medishare-blue" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>View profile</DropdownMenuItem>
            <DropdownMenuItem>Search in conversation</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Block user</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ConversationHeader;
