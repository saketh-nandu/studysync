import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Bot, Send } from "lucide-react";

interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export function AIChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content: "Hello! I'm your AI study assistant. I can help you with math, science, coding, writing, and more. What would you like to know?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const quickQuestions = [
    "Explain photosynthesis",
    "Help with calculus",
    "Python programming basics",
    "Essay writing tips",
    "Study schedule advice",
    "Time management",
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/chat", {
        message: inputMessage,
      });

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.response || "I'm sorry, I couldn't process your request. Please try again.",
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble connecting right now. Please try again later.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "1",
        content: "Hello! I'm your AI study assistant. I can help you with math, science, coding, writing, and more. What would you like to know?",
        sender: "ai",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary">
          AI-powered academic assistant
        </p>
        <Button onClick={handleClearChat} size="sm" variant="outline">
          <span className="material-icons text-sm mr-1">clear_all</span>
          Clear
        </Button>
      </div>

      {/* Chat Messages */}
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-64 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-surface-variant text-text-primary"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === "ai" && (
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-surface-variant rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Quick Questions */}
      <div className="space-y-2">
        <p className="text-xs text-text-secondary">Quick questions:</p>
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((question, index) => (
            <Badge
              key={index}
              variant="outline"
              className="cursor-pointer hover:bg-surface-variant"
              onClick={() => handleQuickQuestion(question)}
            >
              {question}
            </Badge>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="flex space-x-2">
        <Input
          placeholder="Ask me anything..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <Button
          onClick={handleSendMessage}
          disabled={isLoading || !inputMessage.trim()}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
