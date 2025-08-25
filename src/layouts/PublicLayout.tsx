import React from 'react';
import Footer from '../Components/Footer/Footer';
import Header from '../Components/Header/header';
import { ChatBot } from '../Components/ChatAssistant/ChatBot';
import { ChatProvider } from '../Provider/ChatProvider'; 

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <ChatProvider> 
      <div>
        <Header />
        <main className="flex flex-col pt-[70px]">
          {children}
          <ChatBot />
        </main>
        <Footer />
      </div>
    </ChatProvider>
  );
};

export default PublicLayout;