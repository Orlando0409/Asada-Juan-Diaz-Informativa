export interface ChatRequest {
  prompt: string;
}

export interface ChatResponse {
  response: string;
}

// Simulación de servicio de chat
export const sendChatMessage = async (prompt: string): Promise<ChatResponse> => {
  // Simulamos una respuesta del bot con delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Respuestas predefinidas para testing
  const responses = [
    "¡Hola! Gracias por contactarnos. ¿En qué puedo ayudarte hoy?",
    "Entiendo tu consulta. Permíteme ayudarte con eso.",
    "¿Hay algo más en lo que pueda asistirte?",
    "Gracias por tu pregunta. Aquí tienes la información que necesitas.",
    "¡Por supuesto! Estoy aquí para ayudarte."
  ];
  
  // Respuesta aleatoria para simular un bot real
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  return {
    response: `${randomResponse} (Respondiendo a: "${prompt}")`
  };
};

// Para cuando tengas una API real, usarías algo así:
/*
export const sendChatMessage = async (prompt: string): Promise<ChatResponse> => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });
  
  if (!response.ok) {
    throw new Error('Error al comunicarse con el servidor');
  }
  
  return response.json();
};
*/