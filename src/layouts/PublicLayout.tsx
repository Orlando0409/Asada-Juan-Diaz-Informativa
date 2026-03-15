import React, { useRef, useEffect } from 'react';
import { useRouterState } from '@tanstack/react-router';
import Footer from '../Components/Footer/Footer';
import Header from '../Components/Header/header';
import { ChatBot } from '../Components/ChatAssistant/ChatBot';
import { ChatProvider } from '../Provider/ChatProvider';
import { ModalProvider } from '../context/ModalContext';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { location } = useRouterState();

  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <ModalProvider>
      <ChatProvider>
        <div ref={containerRef} className='overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100'>
          <Header />
          <main className="flex flex-col">
            {children}
            <ChatBot />
          </main>
          <Footer />
        </div>
      </ChatProvider>
    </ModalProvider>
  );
};

export default PublicLayout;