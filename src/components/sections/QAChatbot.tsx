
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, User, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getToolPrompt, buildPromptWithContext } from "@/config/backendConfig";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface QAChatbotProps {
  onConfigOpen?: () => void;
}

export function QAChatbot({ onConfigOpen }: QAChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add welcome message on component mount
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm your QA Assistant. Ask me anything about testing methodologies, automation frameworks, best practices, or any QA-related questions you have.",
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Get saved configuration
      const savedConfig = localStorage.getItem("qaToolsEndpointConfig");
      let baseUrl = "http://localhost:3001";
      let sendMessageEndpoint = "/SendMessage";

      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        baseUrl = config.baseUrl || baseUrl;
        sendMessageEndpoint = config.sendMessageEndpoint || sendMessageEndpoint;
      }

      // Build the prompt using the QA Chatbot configuration
      const enhancedPrompt = buildPromptWithContext('chatbot', userMessage.content);

      const response = await fetch(`${baseUrl}${sendMessageEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tool: 'chatbot',
          prompt: enhancedPrompt,
          conversationHistory: messages.slice(-5) // Send last 5 messages for context
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const assistantResponse = data.response || "I apologize, but I couldn't process your request right now. Please try again.";

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I couldn't connect to the QA service right now. Please check your endpoint configuration and try again.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Could not connect to QA service. Check your endpoint configuration.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm your QA Assistant. Ask me anything about testing methodologies, automation frameworks, best practices, or any QA-related questions you have.",
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-pink-500 rounded flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <span>QA Chatbot</span>
            <Badge variant="secondary">AI Assistant</Badge>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={clearChat}>
              Clear Chat
            </Button>
            {onConfigOpen && (
              <Button variant="outline" size="sm" onClick={onConfigOpen}>
                Configure
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-4">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 border rounded-lg p-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-2 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white ml-auto'
                    : 'bg-white border'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
              
              {message.role === 'user' && (
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex space-x-2">
          <Input
            placeholder="Ask me anything about QA, testing, or automation..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-1"
            maxLength={1000}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <p className="text-xs text-gray-500 mt-2 text-center">
          {input.length}/1000 characters • Press Enter to send
        </p>
      </CardContent>
    </Card>
  );
}
