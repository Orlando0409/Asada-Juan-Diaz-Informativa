import React, { Suspense, lazy, useRef, useEffect, useState } from 'react';
import { useRouterState } from '@tanstack/react-router';
import Footer from '../Components/Footer/Footer';
import Header from '../Components/Header/header';
import { ModalProvider } from '../context/ModalContext';

const ChatBot = lazy(() => import('../Components/ChatAssistant/ChatBot').then((module) => ({ default: module.ChatBot })));
const ChatProvider = lazy(() => import('../Provider/ChatProvider').then((module) => ({ default: module.ChatProvider })));

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { location } = useRouterState();
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    globalThis.window.requestAnimationFrame(() => {
      globalThis.window.scrollTo(0, 0);
      if (container) container.scrollTop = 0;
    });
  }, [location.pathname]);

  useEffect(() => {
    if (showChat) return;

    const handleFirstInteraction = () => {
      setShowChat(true);
    };

    globalThis.window.addEventListener('pointerdown', handleFirstInteraction, { once: true, passive: true });
    globalThis.window.addEventListener('scroll', handleFirstInteraction, { once: true, passive: true });
    globalThis.window.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      globalThis.window.removeEventListener('pointerdown', handleFirstInteraction);
      globalThis.window.removeEventListener('scroll', handleFirstInteraction);
      globalThis.window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [showChat]);

  return (
    <ModalProvider>
      <div ref={containerRef} className='overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100'>
        <Header />
        <main className="flex flex-col">
          {children}
          {showChat && (
            <Suspense fallback={null}>
              <ChatProvider>
                <ChatBot />
              </ChatProvider>
            </Suspense>
          )}
        </main>
        <Footer />
      </div>
    </ModalProvider>
  );
};

export default PublicLayout;