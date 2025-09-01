import contextoOrganizacion from '../data/Data.json';

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
    this.apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.ApiKey}`;
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

  // Construye el cuerpo de la petición para Gemini
  private buildRequestBody(prompt: string, context: string) {
    return {
      contents: [{
        parts: [{
          text: `${context}

                Pregunta del usuario: ${prompt}

                Instrucciones:
                - Responde de manera amigable y profesional
                - Mantente en el contexto de ${contextoOrganizacion.DatosGenerales.nombre}
                - Si la pregunta no está relacionada, redirige amablemente
                - Sé conciso pero informativo
                - Usa un tono conversacional`
        }]
      }]
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