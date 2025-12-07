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
      <div className='overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100'>
        <Header />
        <main className="flex flex-col">
          {children}
          <ChatBot />
        </main>
        <Footer />
      </div>
    </ChatProvider>
  );
};

export default PublicLayout;