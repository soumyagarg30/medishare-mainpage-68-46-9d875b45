import React, { useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Send, X, Volume2, VolumeX, Globe, Settings, Loader2 } from "lucide-react";
import { getLocalizedText } from "@/utils/responseGenerator";
import { ChatMessage } from "@/types/chatbot";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  input: string;
  isListening: boolean;
  isSpeaking: boolean;
  voiceEnabled: boolean;
  currentLanguage: string;
  showLanguageMenu: boolean;
  isLoading?: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  onToggleListening: () => void;
  onToggleVoice: () => void;
  onClearChat: () => void;
  onLanguageSelect: (lang: string) => void;
  onToggleLanguageMenu: () => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onOpenApiKeyModal?: () => void;
  supportedLanguages: Record<string, string>;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  input,
  isListening,
  isSpeaking,
  voiceEnabled,
  currentLanguage,
  showLanguageMenu,
  isLoading = false,
  onInputChange,
  onSend,
  onToggleListening,
  onToggleVoice,
  onClearChat,
  onLanguageSelect,
  onToggleLanguageMenu,
  onKeyPress,
  onOpenApiKeyModal,
  supportedLanguages
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatMessage = (content: string) => {
    const processSection = (section: string) => {
      const lines = section.trim().split('\n').filter(Boolean);
      
      if (lines.length === 0) return null;
      
      const [title, ...contentLines] = lines;
      
      const formattedContent = contentLines.map((line, index) => {
        if (line.trim().startsWith('- ')) {
          return (
            <li key={index} className="pl-4 list-disc ml-4">
              {line.replace(/^-\s*/, '')}
            </li>
          );
        }
        
        if (line.includes(':')) {
          const [subTitle, subContent] = line.split(':');
          return (
            <div key={index} className="ml-4 mb-2">
              <span className="font-semibold">{subTitle.trim()}:</span> {subContent.trim()}
            </div>
          );
        }
        
        return <p key={index} className="mb-2">{line}</p>;
      });
      
      return (
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-2 text-medishare-blue">{title}</h3>
          {formattedContent.length > 0 && (
            <ul className="space-y-1">
              {formattedContent}
            </ul>
          )}
        </div>
      );
    };

    const sections = content.split('###').filter(Boolean);
    
    return (
      <div className="space-y-3">
        {sections.map((section, index) => (
          <React.Fragment key={index}>
            {processSection(section)}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">{getLocalizedText("AI Health Assistant", currentLanguage)}</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onToggleLanguageMenu} 
              aria-label={getLocalizedText("Change Language", currentLanguage)}
            >
              <Globe className="h-5 w-5" />
            </Button>
            
            {showLanguageMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 py-1 max-h-60 overflow-y-auto">
                {Object.keys(supportedLanguages).map((lang) => (
                  <button
                    key={lang}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => onLanguageSelect(lang)}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
          {onOpenApiKeyModal && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onOpenApiKeyModal} 
              aria-label="API Settings"
              title="Set Gemini API Key"
            >
              <Settings className="h-5 w-5" />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggleVoice} 
            aria-label={voiceEnabled ? getLocalizedText("Disable voice", currentLanguage) : getLocalizedText("Enable voice", currentLanguage)}
          >
            {voiceEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClearChat} 
            aria-label={getLocalizedText("Clear chat", currentLanguage)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === "user"
                  ? "bg-medishare-orange text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {message.role === "assistant" ? formatMessage(message.content) : message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 max-w-[80%] p-3 rounded-lg flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin text-medishare-blue" />
              <span>Generating response...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t">
        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={onInputChange}
            onKeyDown={onKeyPress}
            placeholder={getLocalizedText("Type your message...", currentLanguage)}
            className="resize-none"
            rows={2}
            disabled={isLoading}
          />
          <div className="flex flex-col gap-2">
            <Button
              onClick={onToggleListening}
              variant={isListening ? "destructive" : "outline"}
              size="icon"
              className="h-10 w-10"
              disabled={isLoading}
              aria-label={isListening ? getLocalizedText("Stop listening", currentLanguage) : getLocalizedText("Start listening", currentLanguage)}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            <Button
              onClick={onSend}
              disabled={!input.trim() || isLoading}
              variant="default"
              size="icon"
              className="bg-medishare-orange hover:bg-medishare-gold h-10 w-10"
              aria-label={getLocalizedText("Send message", currentLanguage)}
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
