import { useChat } from "./Chatbot";

// HOOK PARA MENSAJES PREDEFINIDOS
export function usePredefinedMessages() {
  const { sendMessage } = useChat();

  const predefinedMessages = [
    {
      id: 1,
      label: "¿Qué es la ASADA?",
      text: "¿Qué es la ASADA Juan Díaz?",
      category: "organizacion"
    },
    {
      id: 2,
      label: "Cómo afiliarse",
      text: "¿Cómo puedo afiliarme como abonado?",
      category: "afiliacion"
    },
    {
      id: 3,
      label: "Servicios disponibles",
      text: "¿Qué servicios ofrecen?",
      category: "servicios"
    },
    {
      id: 4,
      label: "Consultar pagos",
      text: "¿Cómo puedo consultar mis pagos?",
      category: "pagos"
    },
    {
      id: 5,
      label: "Información de contacto",
      text: "¿Cuál es la información de contacto?",
      category: "contacto"
    }
  ];

  const sendPredefinedMessage = (id: number) => {
    const message = predefinedMessages.find(msg => msg.id === id);
    if (message) {
      sendMessage(message.text);
    } 
  };

  return {
    predefinedMessages,
    sendPredefinedMessage
  };
}
