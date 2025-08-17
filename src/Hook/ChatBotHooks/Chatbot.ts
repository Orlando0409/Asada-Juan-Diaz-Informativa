import { useState, createContext, useContext } from 'react';
import { useMutation } from '@tanstack/react-query';
import { chatbotService } from '../../Services/Chatbot/ChatbotService';
import type { Message, ChatError, ChatContextType } from '../../types/Chatbot';



// CREAR CONTEXTO
export const ChatContext = createContext<ChatContextType | null>(null);

// HOOK PARA USAR EL CONTEXTO
export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat debe usarse dentro de un ChatProvider');
  }
  return context;
}


//  HOOK PARA LA LÓGICA DEL CHAT 
export function useChatLogic() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<ChatError | null>(null);


  const chatMutation = useMutation({
    mutationFn: (prompt: string) => {
      return chatbotService.processMessage(prompt);
    },
    onSuccess: (data) => {
      console.log('✅ chatMutation onSuccess:', data);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        category: data.category,
        confidence: data.confidence
      };

      setMessages(prev => {
        const newMessages = [...prev, assistantMessage];
        return newMessages;
      });
      setError(null);
    },
    onError: (error) => {
      setError({ 
        message: 'Error al procesar mensaje. Intenta nuevamente. ' + error.message,
        isAPIError: true 
      });
    }
  });

  const sendMessage = (content: string) => {
    
    if (!content.trim()) {
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => {
      const newMessages = [...prev, userMessage];
      return newMessages;
    });
    
    setError(null);
    chatMutation.mutate(content.trim());
  };

  const clearMessages = () => {
    setMessages([]);
    setError(null);
    chatMutation.reset();
  };

  const retryLastMessage = () => {
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    if (lastUserMessage && !chatMutation.isPending) {
      chatMutation.mutate(lastUserMessage.content);
    }
  };

  return {
    messages,
    isLoading: chatMutation.isPending,
    error,
    sendMessage,
    clearMessages,
    retryLastMessage,
    lastMessage: messages[messages.length - 1],
    lastMessageCategory: messages[messages.length - 1]?.category,
    messageCount: messages.length,
    userMessageCount: messages.filter(m => m.role === 'user').length,
    assistantMessageCount: messages.filter(m => m.role === 'assistant').length,
    isOnline: !error?.isAPIError,
    hasMessages: messages.length > 0,
    canRetry: messages.some(m => m.role === 'user') && !chatMutation.isPending
  };
}