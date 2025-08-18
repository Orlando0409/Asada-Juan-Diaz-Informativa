import { HiSparkles } from "react-icons/hi";

// Mensajes predefinidos
export function PredefinedMessages({ onSelectMessage, isLoading, predefinedMessages }: Readonly<{ onSelectMessage: (index: number) => 
    void; 
  isLoading: boolean;
  predefinedMessages: Array<{
    id: number;
    label: string;
    message: string;
    category: string;
  }>;
}>) {

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2 text-gray-600">
        <HiSparkles className="w-4 h-4" />
        <span className="text-sm font-medium">Preguntas frecuentes:</span>
      </div>
      
      <div className="grid gap-2">
        {predefinedMessages.map((msg) => (
          <button
            key={msg.label}
            onClick={() => {
              onSelectMessage(msg.id);
            }}
            disabled={isLoading}
            className="text-left p-3 text-sm bg-blue-50 hover:bg-blue-100 
                     border border-blue-200 rounded-lg transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-blue-700">{msg.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}