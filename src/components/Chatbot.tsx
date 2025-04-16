
import React, { useState, useRef, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSpeechServices } from "@/hooks/useSpeechServices";
import { LANGUAGES, detectLanguage } from "@/utils/languageDetection";
import { generateStructuredResponse, getWelcomeMessage } from "@/utils/responseGenerator";
import ChatContainer from "./chatbot/ChatContainer";
import { ChatMessage } from "@/types/chatbot";
import { generateGeminiResponse, getGeminiApiKey, setGeminiApiKey } from "@/utils/chat/geminiService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Chatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hello! I'm your AI assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState<string>("English");
  const [languageCode, setLanguageCode] = useState<string>("en-US");
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const lastDetectedLanguage = useRef<string>("English");
  const isMobile = useIsMobile();

  const { 
    isListening, 
    isSpeaking, 
    toggleListening, 
    speakText, 
    stopSpeaking 
  } = useSpeechServices({
    languageCode,
    currentLanguage,
    voiceEnabled
  });

  // Check if Gemini API key is set on initial load
  useEffect(() => {
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      setIsApiKeyModalOpen(true);
    }
  }, []);

  // Initialize welcome message based on language
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === "assistant") {
      setMessages([
        { role: "assistant", content: getWelcomeMessage(currentLanguage) }
      ]);
    }
  }, [currentLanguage, languageCode]);

  // Stop speaking if voice is disabled
  useEffect(() => {
    if (!voiceEnabled && isSpeaking) {
      stopSpeaking();
    }
  }, [voiceEnabled, isSpeaking, stopSpeaking]);

  const changeLanguage = (language: string) => {
    setCurrentLanguage(language);
    setLanguageCode(LANGUAGES[language as keyof typeof LANGUAGES]);
    setShowLanguageMenu(false);
  };

  const handleToggleListening = () => {
    toggleListening((transcript) => {
      setInput(transcript);
      // Submit transcript automatically
      handleSend(transcript);
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;
    
    // Detect language from user input
    const detectedLanguage = detectLanguage(text);
    
    // Update current language if detection is confident
    if (detectedLanguage !== currentLanguage) {
      changeLanguage(detectedLanguage);
      lastDetectedLanguage.current = detectedLanguage;
    }
    
    // Add user message
    const userMessage = { role: "user" as const, content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      // Check if we have the API key set
      const apiKey = getGeminiApiKey();
      
      let responseContent: string;
      
      if (apiKey) {
        // Use Gemini API for response generation
        responseContent = await generateGeminiResponse([...messages, userMessage]);
      } else {
        // Fall back to the default response generator
        responseContent = generateStructuredResponse(text, detectedLanguage);
        // Prompt to set API key
        setIsApiKeyModalOpen(true);
      }
      
      const aiResponse = { 
        role: "assistant" as const, 
        content: responseContent
      };
      
      setMessages((prev) => [...prev, aiResponse]);
      
      // Convert AI response to speech if voice is enabled
      if (voiceEnabled) {
        speakText(aiResponse.content);
      }
    } catch (error) {
      console.error("Error generating response:", error);
      setMessages((prev) => [
        ...prev, 
        { 
          role: "assistant", 
          content: "Sorry, I encountered an error while processing your request. Please try again later."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      setGeminiApiKey(apiKeyInput.trim());
      setIsApiKeyModalOpen(false);
      setApiKeyInput("");
      // Add a success message
      setMessages((prev) => [
        ...prev, 
        { 
          role: "assistant", 
          content: "Thank you! I'm now connected to the Gemini AI and can provide you with better information about diseases, government healthcare programs in India, and available resources."
        }
      ]);
    }
  };

  const toggleVoice = () => {
    // If turning voice off, make sure to stop any ongoing speech
    if (voiceEnabled) {
      stopSpeaking();
    }
    setVoiceEnabled(!voiceEnabled);
  };

  const clearChat = () => {
    stopSpeaking();
    setMessages([
      { role: "assistant", content: getWelcomeMessage(currentLanguage) }
    ]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <ChatContainer
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isMobile={isMobile}
        messages={messages}
        input={input}
        isListening={isListening}
        isSpeaking={isSpeaking}
        voiceEnabled={voiceEnabled}
        currentLanguage={currentLanguage}
        showLanguageMenu={showLanguageMenu}
        isLoading={isLoading}
        onInputChange={handleInputChange}
        onSend={() => handleSend()}
        onToggleListening={handleToggleListening}
        onToggleVoice={toggleVoice}
        onClearChat={clearChat}
        onLanguageSelect={changeLanguage}
        onToggleLanguageMenu={() => setShowLanguageMenu(!showLanguageMenu)}
        onKeyPress={handleKeyPress}
        supportedLanguages={LANGUAGES}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
      />

      {/* API Key Modal */}
      {isApiKeyModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Set Gemini API Key</h2>
            <p className="mb-4">
              To enable advanced AI responses about diseases, healthcare programs, and resources, 
              please enter your Google Gemini API key. You can get one for free from 
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-medishare-blue ml-1 hover:underline"
              >
                Google AI Studio
              </a>.
            </p>
            <div className="mb-4">
              <Input
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="Enter your Gemini API key"
                className="w-full"
                type="password"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsApiKeyModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveApiKey} className="bg-medishare-blue hover:bg-medishare-blue/90">
                Save API Key
              </Button>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              Your API key will be stored locally in your browser and is not sent to our servers.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
