import { useState, createContext, useContext } from 'react';
import { useMutation } from '@tanstack/react-query';
import { chatbotService } from '../Services/Chatbot/ChatbotService';
import type { Message, ChatError } from '../types/Chatbot';

// ✅ 1. TIPOS E INTERFACES
interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  error: ChatError | null;
  sendMessage: (content: string) => void;
  clearMessages: () => void;
  retryLastMessage: () => void;
  lastMessage: Message | undefined;
  lastMessageCategory: string | undefined;
  messageCount: number;
  userMessageCount: number;
  assistantMessageCount: number;
  isOnline: boolean;
  hasMessages: boolean;
  canRetry: boolean;
}

// ✅ 2. CREAR CONTEXTO
export const ChatContext = createContext<ChatContextType | null>(null);

// ✅ 3. HOOK PARA USAR EL CONTEXTO
export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat debe usarse dentro de un ChatProvider');
  }
  return context;
}

// ✅ 4. HOOK PARA MENSAJES PREDEFINIDOS
export function usePredefinedMessages() {
  const { sendMessage } = useChat();

  const predefinedMessages = [
    {
      id: 1,
      label: "¿Qué es ASADA?",
      text: "¿Qué es la ASADA Juan Díaz?",
      category: "organizacion"
    },
    {
      id: 2,
      label: "Cómo afiliarse",
      text: "¿Cómo puedo afiliarme como abonado?",
      category: "afiliacion"
    },
    {
      id: 3,
      label: "Servicios disponibles",
      text: "¿Qué servicios ofrecen?",
      category: "servicios"
    },
    {
      id: 4,
      label: "Consultar pagos",
      text: "¿Cómo puedo consultar mis pagos?",
      category: "pagos"
    },
    {
      id: 5,
      label: "Información de contacto",
      text: "¿Cuál es la información de contacto?",
      category: "contacto"
    }
  ];

  const sendPredefinedMessage = (id: number) => {
    console.log('🎯 sendPredefinedMessage llamado con ID:', id);
    
    const message = predefinedMessages.find(msg => msg.id === id);
    console.log('📩 Mensaje encontrado:', message);
    
    if (message) {
      console.log('✅ Enviando mensaje predefinido:', message.text);
      sendMessage(message.text);
    } else {
      console.error('❌ No se encontró mensaje con ID:', id);
    }
  };

  return {
    predefinedMessages,
    sendPredefinedMessage
  };
}

// ✅ 5. HOOK PARA LA LÓGICA DEL CHAT (sin UI)
export function useChatLogic() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<ChatError | null>(null);

  // TanStack Query mutation
  const chatMutation = useMutation({
    mutationFn: (prompt: string) => {
      console.log('🚀 chatMutation ejecutándose con:', prompt);
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
        console.log('🤖 Agregando respuesta del bot. Total messages:', newMessages.length);
        return newMessages;
      });
      setError(null);
    },
    onError: (error) => {
      console.error('❌ chatMutation onError:', error);
      setError({ 
        message: 'Error al procesar mensaje. Intenta nuevamente. ' + error.message,
        isAPIError: true 
      });
    }
  });

  const sendMessage = (content: string) => {
    console.log('📤 sendMessage llamado con:', content);
    
    if (!content.trim()) {
      console.log('❌ Contenido vacío, saliendo...');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    console.log('👤 Agregando mensaje del usuario:', userMessage);
    setMessages(prev => {
      const newMessages = [...prev, userMessage];
      console.log('📝 Total messages después de agregar usuario:', newMessages.length);
      return newMessages;
    });
    
    setError(null);
    console.log('🤖 Ejecutando mutation...');
    chatMutation.mutate(content.trim());
  };

  const clearMessages = () => {
    console.log('🧹 Limpiando mensajes...');
    setMessages([]);
    setError(null);
    chatMutation.reset();
  };

  const retryLastMessage = () => {
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    if (lastUserMessage && !chatMutation.isPending) {
      console.log('🔄 Reintentando último mensaje:', lastUserMessage.content);
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