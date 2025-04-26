
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatInterfaceProps {
  isUnlocked: boolean;
  onAiResponse: (response: string) => void;
}

const initialMessage: Message = {
  id: 1,
  text: "Por que você acha que merece ganhar o prêmio?",
  sender: 'ai',
  timestamp: new Date()
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ isUnlocked, onAiResponse }) => {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    
    if (!isUnlocked) {
      toast({
        title: "Chat bloqueado!",
        description: "Faça o pagamento para desbloquear o chat.",
        variant: "destructive"
      });
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking and respond
    setTimeout(() => {
      const aiResponse = getAiResponse(inputValue);
      
      const aiMessage: Message = {
        id: messages.length + 2,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, aiMessage]);
      setIsTyping(false);
      onAiResponse(aiResponse);
    }, 2000);
  };

  const getAiResponse = (userMessage: string): string => {
    const userMessageLower = userMessage.toLowerCase();
    
    if (userMessageLower.includes("por favor") && (userMessageLower.includes("preciso") || userMessageLower.includes("necessito"))) {
      return "Entendo sua situação, mas preciso de argumentos mais convincentes.";
    } else if (userMessageLower.includes("doar") && userMessageLower.includes("caridade")) {
      return "Nobre da sua parte pensar em caridade, mas preciso de um motivo realmente excepcional.";
    } else if (userMessageLower.includes("investir") && (userMessageLower.includes("negócio") || userMessageLower.includes("startup"))) {
      return "Uma ideia de negócio interessante, mas muitos antes de você já tentaram esse argumento.";
    } else {
      return "Hmm, não estou convencida. Tente novamente com um argumento mais original e persuasivo!";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[400px] md:h-[500px] bg-theme-dark-purple border border-theme-purple rounded-lg shadow-lg overflow-hidden">
      {/* Chat messages area */}
      <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-theme-purple scrollbar-track-theme-dark-purple">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.sender === 'user' 
                  ? 'bg-theme-purple text-white' 
                  : 'bg-gray-800 text-theme-light-purple border border-theme-purple'
              }`}
            >
              <p>{message.text}</p>
              <div className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-theme-purple">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-theme-purple rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-theme-purple rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-theme-purple rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input area */}
      <div className="border-t border-theme-purple p-4">
        <div className="flex items-center">
          <textarea
            className="flex-1 bg-gray-800 border border-theme-purple rounded-lg px-4 py-2 text-white resize-none focus:outline-none focus:ring-2 focus:ring-theme-purple"
            placeholder={isUnlocked ? "Digite sua mensagem..." : "Chat bloqueado - Faça o pagamento para desbloquear"}
            rows={2}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={!isUnlocked}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!isUnlocked || inputValue.trim() === ''}
            className="ml-2 bg-theme-purple hover:bg-theme-vivid-purple text-white rounded-full p-2"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
