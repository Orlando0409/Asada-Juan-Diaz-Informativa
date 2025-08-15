import  type{ ReactNode } from 'react';
import { ChatContext, useChatLogic } from '../Hook/Chatbot';

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: Readonly<ChatProviderProps>) {
  const chatLogic = useChatLogic();

  return (
    <ChatContext.Provider value={chatLogic}>
      {children}
    </ChatContext.Provider>
  );
}