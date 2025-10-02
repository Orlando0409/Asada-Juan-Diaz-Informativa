import dataJson from '../data/Data.json';

// Cliente para la API de Google Gemini
export class GeminiAPIClient {
  private readonly ApiKey: string;
  private readonly apiUrl: string;

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('VITE_GEMINI_API_KEY no está configurada');
    }
    
    this.ApiKey = apiKey;
    // Usar gemini-2.0-flash-001 que está disponible en GA según las notas de versión
    this.apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-001:generateContent?key=${this.ApiKey}`;
  }

  //Envía un prompt a la API de Gemini
  async sendMessage(prompt: string, context: string): Promise<string> {
    const requestBody = this.buildRequestBody(prompt, context);
    
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return this.extractResponseText(data);
  }

  // Construye el cuerpo de la petición para Gemini con datos reales
  private buildRequestBody(prompt: string, context: string) {
    const { DatosGenerales, footer, mision, vision } = dataJson;
    
    // Construir información de contacto real
    const contactoInfo = `
    INFORMACIÓN DE CONTACTO REAL (USAR ESTOS DATOS EXACTOS):
    📞 Teléfono: ${footer.contacto.telefono}
    📧 Email: ${footer.contacto.correo}
    💬 WhatsApp: ${footer.redesSociales.WhatsApp}
    🕐 Horario: ${footer.horarioAtencion}
    📍 Dirección: ${DatosGenerales.ubicacion}
    🏢 Organización: ${DatosGenerales.nombre}`;

    const organizacionInfo = `
    DATOS DE LA ORGANIZACIÓN:
    📋 Misión: ${mision}
    🌟 Visión: ${vision}
    📅 Fundada en: ${DatosGenerales.añoFundacion}
    💧 Servicio: ${DatosGenerales.servicios.descripcion}
    📝 Descripción: ${DatosGenerales.descripcion}`;

    return {
      contents: [{
        parts: [{
          text: `${context}

          ${contactoInfo}

          ${organizacionInfo}

          Pregunta del usuario: "${prompt}"

          INSTRUCCIONES CRÍTICAS:
          1. USA ÚNICAMENTE los datos reales proporcionados arriba
          2. NUNCA uses placeholders como [Insertar número aquí] o [Insertar correo aquí]
          3. Si necesitas mencionar contacto, usa los datos exactos: ${footer.contacto.telefono}, ${footer.contacto.correo}
          4. Responde de manera amigable y profesional
          5. Mantente en el contexto de ${DatosGenerales.nombre} (ASADA Juan Díaz)
          6. Si la pregunta no está relacionada con ASADA, redirige amablemente
          7. Sé conciso pero informativo (máximo 200 palabras)
          8. Usa emojis apropiados para hacer la respuesta más amigable
          9. Si mencionas horarios, usa: ${footer.horarioAtencion}
          10. Si mencionas ubicación, usa: ${DatosGenerales.ubicacion}

          FORMATO DE RESPUESTA:
          - Saluda amigablemente si es apropiado
          - Responde la pregunta específica
          - Proporciona información adicional relevante si es útil
          - Termina con una pregunta de seguimiento si es apropiado`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 300,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH", 
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };
  }

  // Extrae el texto de respuesta de la respuesta de la API
  private extractResponseText(data: any): string {
    if (!data.candidates?.[0]?.content) {
      throw new Error('Respuesta de API malformada');
    }

    return data.candidates[0].content.parts[0].text;
  }
}