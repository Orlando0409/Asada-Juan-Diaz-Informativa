import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, Card } from './Ui';
import { useChat, usePredefinedMessages } from '../../Hook/Chatbot';
import { BsChatDots } from 'react-icons/bs';
import { IoClose, IoSend, IoRefresh } from 'react-icons/io5';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { StatusIndicator } from './StatusIndicator';
import { PredefinedMessages } from './PredefinedMessages';

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  
  // Hooks del chatbot
  const { messages, isLoading, error, sendMessage, clearMessages, isOnline, retryLastMessage, hasMessages } = useChat();
  const { predefinedMessages, sendPredefinedMessage } = usePredefinedMessages();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // función scrollToBottom 
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'end' 
    });
  };

  useEffect(() => {
    // Scroll cuando cambien los mensajes o cuando esté cargando
    if (messages.length > 0 || isLoading) {
      // Pequeño delay para asegurar que el DOM se haya actualizado
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isLoading]);

  //También scroll cuando se abre el chat
  useEffect(() => {
    if (isOpen && hasMessages) {
      setTimeout(scrollToBottom, 300);
    }
  }, [isOpen, hasMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  const handlePredefinedMessage = (id: number) => {
    sendPredefinedMessage(id);
  };

  return (
    <>
      {/* Botón flotante con indicador de estado */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="relative">
          <Button
            onClick={() => setIsOpen(true)}
            className="w-12 h-12 flex justify-center items-center rounded-full shadow-lg"
          >
            <BsChatDots className="w-10 h-10" />
          </Button>
          
          {/*puntito indicador de estado en el botón flotante */}
          <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white bg-green-500`} />
        </div>
      </div>

      {/* Modal del chat */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
          <button 
            className="absolute inset-0 bg-black/20 cursor-default" 
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
          />
          
          <Card className="relative w-full max-w-md h-[600px] flex flex-col overflow-hidden">
            {/* Header con indicador de estado */}
            <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
              <div>
                <h2 className="font-semibold text-gray-900">Chat Asistente</h2>
                <StatusIndicator isOnline={isOnline} />
              </div>
              
              <div className="flex space-x-1">
                {hasMessages && (
                    <button 
                      onClick={clearMessages}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                      title="Limpiar conversación"
                    >
                      <IoRefresh className="w-4 h-4" />
                    </button>
                )}
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                  title="Cerrar chat"
                >
                  <IoClose className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mensajes */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
              style={{ 
                scrollBehavior: 'smooth',
                overflowAnchor: 'none'
              }}
            >
              {!hasMessages ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                  <div>
                    <h3 className="text-lg text-gray-900 font-medium mb-2">¡Hola! Soy tu asistente</h3>
                    <p className="text-gray-600">¿En qué puedo ayudarte?</p>
                  </div>
                  
                  <div className="w-full">
                    <PredefinedMessages 
                      onSelectMessage={handlePredefinedMessage}
                      isLoading={isLoading}
                      predefinedMessages={predefinedMessages.map(msg => ({ ...msg, message: msg.text }))} 
                    />
                  </div>
                </div>
              ) : (
                <>
                  {messages.map(message => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                  {isLoading && <TypingIndicator />}
                  
                  {/* Elemento invisible para hacer auto scroll */}
                  <div ref={messagesEndRef} className="h-1" />
                </>
              )}
            </div>

            {/* Error con opción de reintentar */}
            {error && (
              <div className="mx-4 mb-2 p-3 bg-red-50 border border-red-200 rounded-md flex-shrink-0">
                <p className="text-sm text-red-700 mb-2">{error.message}</p>
                {error.isAPIError && (
                  <button
                    onClick={retryLastMessage}
                    disabled={isLoading}
                    className="text-xs text-red-600 hover:text-red-800 underline disabled:opacity-50"
                  >
                    Reintentar último mensaje
                  </button>
                )}
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t flex-shrink-0">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu mensaje..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={!input.trim() || isLoading} title='Enviar mensaje'>
                <IoSend className="w-4 h-4" />
              </Button>
            </form>
          </Card>
        </div>
      )}
    </>
  );
}