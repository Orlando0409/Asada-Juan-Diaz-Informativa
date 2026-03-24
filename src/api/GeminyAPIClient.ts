import dataJson from '../data/Data.json';
import chatContexto from '../data/ChatContexto.json';

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
    // Usar gemini-2.5-flash que está disponible en GA según las notas de versión
   this.apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${this.ApiKey}`;
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
    const { DatosGenerales, footer, mision, vision, requisitosSolicitudes, RequisitosContacto } = dataJson;
    const { keywords, respuestas_optimizadas } = chatContexto;
    
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

    const solicitudesInfo = `
    SOLICITUDES DISPONIBLES:
    
    1️⃣ Afiliación como Abonado:
       ${Object.entries(requisitosSolicitudes.abonado).map(([_, field]: [string, any]) => 
         `- ${field.label}${field.required ? ' (Obligatorio)' : ' (Opcional)'}`
       ).join('\n       ')}
    
    2️⃣ Solicitud de Asociado:
       ${Object.entries(requisitosSolicitudes.asociado).map(([_, field]: [string, any]) => 
         `- ${field.label}${field.required ? ' (Obligatorio)' : ' (Opcional)'}`
       ).join('\n       ')}
    
    3️⃣ Cambio de Medidor:
       ${Object.entries(requisitosSolicitudes.cambioMedidor).map(([_, field]: [string, any]) => 
         `- ${field.label}${field.required ? ' (Obligatorio)' : ' (Opcional)'}`
       ).join('\n       ')}
    
    4️⃣ Desconexión de Medidor:
       ${Object.entries(requisitosSolicitudes.desconexion).map(([_, field]: [string, any]) => 
         `- ${field.label}${field.required ? ' (Obligatorio)' : ' (Opcional)'}`
       ).join('\n       ')}`;

    const contactoFormulariosInfo = `
    FORMULARIOS DE CONTACTO:
    
    📝 Reportes (problemas técnicos):
       ${Object.entries(RequisitosContacto.requisitosReportes).map(([_, field]: [string, any]) => 
         `- ${field.label}${field.required ? ' (Obligatorio)' : ' (Opcional)'}`
       ).join('\n       ')}
    
    📢 Quejas:
       ${Object.entries(RequisitosContacto.requisitosQuejas).map(([_, field]: [string, any]) => 
         `- ${field.label}${field.required ? ' (Obligatorio)' : ' (Opcional)'}`
       ).join('\n       ')}
    
    💡 Sugerencias:
       ${Object.entries(RequisitosContacto.requisitosSugerencias).map(([_, field]: [string, any]) => 
         `- ${field.label}${field.required ? ' (Obligatorio)' : ' (Opcional)'}`
       ).join('\n       ')}`;

    const pagosInfo = `
    INFORMACIÓN DE PAGOS Y CONSULTAS:
    
    💰 Métodos de pago:
    ${respuestas_optimizadas?.metodos_pago?.join('\n    - ') || 'Información no disponible'}
    
    📊 Tipos de pago:
    - Mensual: ${respuestas_optimizadas?.tipos_pago?.mensual || 'Consultar'}
    - Reconexión: ${respuestas_optimizadas?.tipos_pago?.reconexion || 'Consultar'}
    - Mora: ${respuestas_optimizadas?.tipos_pago?.mora || 'Consultar'}`;

    const navegacionInfo = `
    NAVEGACIÓN DE LA PÁGINA WEB:
    
    📂 Secciones principales:
    • Inicio - Información general y bienvenida
    • Sobre Nosotros - Misión, visión, historia, calidad del agua
    • Solicitudes - Afiliación, cambio de medidor, desconexión
    • Consulta de Pagos - Estado de cuenta y facturas
    • Contacto - Reportes, quejas y sugerencias
    • Preguntas Frecuentes - FAQ con respuestas comunes
    
    Todas las solicitudes se realizan mediante formularios en línea en la sección correspondiente.`;

    return {
      contents: [{
        parts: [{
          text: `${context}

          ${contactoInfo}

          ${organizacionInfo}

          ${solicitudesInfo}

          ${contactoFormulariosInfo}

          ${pagosInfo}

          ${navegacionInfo}

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
          11. Si te preguntan sobre requisitos o formularios, usa la información detallada de solicitudes
          12. Si te preguntan sobre navegación, guía al usuario a la sección correcta de la página
          13. Para preguntas sobre pagos, menciona los métodos disponibles
          14. Si es sobre preguntas frecuentes, sugiere visitar la sección de FAQ
          
          KEYWORDS DE CONTEXTO:
          ${Object.entries(keywords).map(([categoria, palabras]: [string, any]) => 
            `${categoria}: ${Array.isArray(palabras) ? palabras.join(', ') : ''}`
          ).join('\n          ')}

          FORMATO DE RESPUESTA:
          - Saluda amigablemente si es apropiado
          - Responde la pregunta específica con datos reales
          - Proporciona información adicional relevante si es útil
          - Si es sobre formularios, menciona la sección específica donde encontrarlo
          - Termina con una pregunta de seguimiento si es apropiado`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 3000,
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