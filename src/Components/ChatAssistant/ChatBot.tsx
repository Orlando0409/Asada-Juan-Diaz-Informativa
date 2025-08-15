import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Card } from './Ui';
import { useChat } from '../../Hook/Chatbot';
import { BsChatDots } from 'react-icons/bs';
import { IoClose, IoSend, IoRefresh } from 'react-icons/io5';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Componente de burbuja de mensaje inline
function MessageBubble({ message }: Readonly<{ message: Message }>) {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
        isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
      }`}>
        <p className="text-sm">{message.content}</p>
        <time className={`text-xs mt-1 block ${
          isUser ? 'text-blue-100' : 'text-gray-500'
        }`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </time>
      </div>
    </div>
  );
}

// Indicador de escritura inline
function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-gray-100 rounded-lg px-4 py-2">
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, isLoading, error, sendMessage, clearMessages } = useChat();


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <>
      {/* Botón flotante */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 rounded-full shadow-lg"
        >
          <BsChatDots className="w-6 h-6" />
        </Button>
      </div>

      {/* Modal del chat */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
          <button 
            className="absolute inset-0 bg-black/20 cursor-default" 
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
          />
          
          <Card className="relative w-full max-w-md h-[600px] flex flex-col overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold text-gray-900">Chat Asistente</h2>
              <div className="flex space-x-1">
                {messages.length > 0 && (
                    <button 
                      onClick={clearMessages}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <IoRefresh className="w-4 h-4" />
                    </button>
                )}
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <IoClose className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <h3 className="text-lg text-gray-900 font-medium mb-2">¡Hola! Soy tu asistente</h3>
                  <p className="text-gray-600">¿En qué puedo ayudarte?</p>
                </div>
              ) : (
                <>
                  {messages.map(message => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                  {isLoading && <TypingIndicator />}
                </>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="mx-4 mb-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-700">{error.message}</p>
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu mensaje..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={!input.trim() || isLoading}>
                <IoSend className="w-4 h-4" />
              </Button>
            </form>
          </Card>
        </div>
      )}
    </>
  );
}