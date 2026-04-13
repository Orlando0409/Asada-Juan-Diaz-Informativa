import React, { Suspense, lazy, useRef, useEffect, useState } from 'react';
import { useRouterState } from '@tanstack/react-router';
import Footer from '../Components/Footer/Footer';
import Header from '../Components/Header/header';
import { ChatProvider } from '../Provider/ChatProvider';
import { ModalProvider } from '../context/ModalContext';

const ChatBot = lazy(() => import('../Components/ChatAssistant/ChatBot').then((module) => ({ default: module.ChatBot })));

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { location } = useRouterState();
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  useEffect(() => {
    const timeoutId = globalThis.setTimeout(() => {
      setShowChat(true);
    }, 1500);

    return () => globalThis.clearTimeout(timeoutId);
  }, []);

  return (
    <ModalProvider>
      <ChatProvider>
        <div ref={containerRef} className='overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100'>
          <Header />
          <main className="flex flex-col">
            {children}
            {showChat && (
              <Suspense fallback={null}>
                <ChatBot />
              </Suspense>
            )}
          </main>
          <Footer />
        </div>
      </ChatProvider>
    </ModalProvider>
  );
};

export default PublicLayout;