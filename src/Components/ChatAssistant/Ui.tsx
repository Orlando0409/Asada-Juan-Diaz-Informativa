import React from 'react';

// Button de enviar
export function Button({ className, ...props }: Readonly<React.ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      className={`px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 ${className || ''}`}
      {...props}
    />
  );
}

// Input de texto
export function Input({ className, ...props }: Readonly<React.InputHTMLAttributes<HTMLInputElement>>) {
  return (
    <input
      className={`w-full text-gray-900 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ''}`}
      {...props}
    />
  );
}

// Card simple
export function Card({ className, children, ...props }: Readonly<React.HTMLAttributes<HTMLDivElement>>) {
  return (
    <div className={`bg-white rounded-lg shadow-lg border ${className || ''}`} {...props}>
      {children}
    </div>
  );
}