
// Gemini API integration for enhanced chatbot responses
import { ChatMessage } from "@/types/chatbot";

// Type definitions for Gemini API
export interface GeminiChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export interface GeminiRequest {
  contents: GeminiChatMessage[];
  generationConfig?: {
    temperature?: number;
    topP?: number;
    topK?: number;
    maxOutputTokens?: number;
  };
}

export interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
      role: string;
    };
    finishReason: string;
  }[];
}

// API key state and management
let geminiApiKey: string | null = null;

export const setGeminiApiKey = (key: string) => {
  geminiApiKey = key;
  localStorage.setItem("gemini_api_key", key);
};

export const getGeminiApiKey = (): string | null => {
  if (!geminiApiKey) {
    geminiApiKey = localStorage.getItem("gemini_api_key");
  }
  return geminiApiKey;
};

// System prompt defining the chatbot's knowledge domain and behavior
const SYSTEM_PROMPT = `
You are a helpful healthcare assistant specializing in:
1. Medical information about diseases, conditions, and treatments
2. Government healthcare programs in India, including eligibility and application processes
3. Available healthcare resources and how to access them
4. Preventive healthcare measures and wellness advice

Focus on providing accurate, up-to-date information with clear explanations. When asked about:
- Medical conditions: provide basic information, symptoms, and general treatment approaches
- Government programs: explain eligibility criteria, benefits, and application processes
- Healthcare resources: provide information on accessing hospitals, clinics, and support services
- Always clarify you're providing general information, not medical advice, and recommend consulting healthcare professionals

Format your responses clearly and concisely. If you don't have specific information, acknowledge this and provide general guidance on where to find it.
`;

// Convert our app's messages format to Gemini format
const prepareMessagesForGemini = (messages: ChatMessage[]): GeminiChatMessage[] => {
  // Start with the system prompt
  const geminiMessages: GeminiChatMessage[] = [
    {
      role: "model",
      parts: [{ text: SYSTEM_PROMPT }]
    }
  ];
  
  // Add conversation history
  messages.forEach(message => {
    geminiMessages.push({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }]
    });
  });
  
  return geminiMessages;
};

// Function to call Gemini API
export const generateGeminiResponse = async (messages: ChatMessage[]): Promise<string> => {
  const apiKey = getGeminiApiKey();
  
  if (!apiKey) {
    return "Please set up your Gemini API key to get AI-powered responses about healthcare and government programs.";
  }
  
  try {
    const geminiMessages = prepareMessagesForGemini(messages);
    
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: geminiMessages,
          generationConfig: {
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 1024
          }
        } as GeminiRequest)
      }
    );
    
    if (!response.ok) {
      const error = await response.text();
      console.error("Gemini API error:", error);
      return "Sorry, there was an error connecting to the AI service. Please try again later.";
    }
    
    const data = await response.json() as GeminiResponse;
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Sorry, there was an error processing your request. Please try again later.";
  }
};
