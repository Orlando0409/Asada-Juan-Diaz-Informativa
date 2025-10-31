import { IntentionDetector } from './IntentionDetector';
import { TokenMonitor } from './TokenMonitor';
import datosGenerales from '../../data/Data.json';

export class RequestAnalyzer {
  
  // Analiza si realmente necesita llamar a la API o puede usar fallback
  static shouldUseAPI(prompt: string): {
    useAPI: boolean;
    reason: string;
    confidence: number;
  } {
    
    // 1. Verificar límites de tokens
    const usage = TokenMonitor.getTodayStats();
    if (usage.tokens > 800000) { // 80% del límite
      return {
        useAPI: false,
        reason: 'Límite diario de tokens alcanzado (80%)',
        confidence: 0.8
      };
    }
    
    // 2. Detectar intención
    const intention = IntentionDetector.detect(prompt);
    
    // 3. Preguntas que NO necesitan API (respuestas exactas disponibles)
    const directAnswerIntentions = [
      'saludo',
      'despedida', 
      'organizacion',
      'contacto',
      'ubicacion',
      'horarios'
    ];
    
    if (directAnswerIntentions.includes(intention as string)) {
      return {
        useAPI: false,
        reason: `Respuesta directa disponible para: ${intention}`,
        confidence: 0.9
      };
    }
    
    // 4. Preguntas simples que el JSON puede responder
    const simpleQuestions = this.detectSimpleQuestions(prompt);
    if (simpleQuestions.isSimple) {
      return {
        useAPI: false,
        reason: `Pregunta simple: ${simpleQuestions.type}`,
        confidence: 0.85
      };
    }
    
    // 5. Preguntas complejas que SÍ necesitan API
    const complexQuestions = this.detectComplexQuestions(prompt);
    if (complexQuestions.isComplex) {
      return {
        useAPI: true,
        reason: `Pregunta compleja: ${complexQuestions.type}`,
        confidence: 0.95
      };
    }
    
    // 6. Por defecto, para preguntas específicas usar API
    if (intention && ['afiliacion', 'servicios', 'solicitudes', 'pagos'].includes(intention)) {
      return {
        useAPI: true,
        reason: `Pregunta específica sobre: ${intention}`,
        confidence: 0.8
      };
    }
    
    // 7. Preguntas fuera de contexto - usar fallback
    return {
      useAPI: false,
      reason: 'Pregunta fuera de contexto de ASADA',
      confidence: 0.7
    };
  }
  
  // Detecta preguntas simples que no necesitan API
  private static detectSimpleQuestions(prompt: string): { isSimple: boolean; type?: string } {
    const lowerPrompt = prompt.toLowerCase();
    
    const simplePatterns = [
      { pattern: /^(hola|buenas|hey|saludos)/, type: 'saludo' },
      { pattern: /^(adiós|bye|gracias|chao)/, type: 'despedida' },
      { pattern: /^(que es|qué es).+(asada|organización)/, type: 'definición básica' },
      { pattern: /^(dónde|donde).+(ubicación|dirección)/, type: 'ubicación' },
      { pattern: /^(cuál|cual).+(teléfono|correo|contacto)/, type: 'contacto básico' },
      { pattern: /^(cuándo|cuando).+(horario|atienden)/, type: 'horarios' },
    ];
    
    for (const { pattern, type } of simplePatterns) {
      if (pattern.test(lowerPrompt)) {
        return { isSimple: true, type };
      }
    }
    
    return { isSimple: false };
  }

  // Detecta preguntas complejas que SÍ necesitan API
  private static detectComplexQuestions(prompt: string): { isComplex: boolean; type?: string } {
    const lowerPrompt = prompt.toLowerCase();
    
    const complexPatterns = [
      { pattern: /como.+(proceso|procedimiento|pasos)/, type: 'proceso detallado' },
      { pattern: /cuáles.+(requisitos|documentos|necesito)/, type: 'requisitos específicos' },
      { pattern: /qué pasa si.+/, type: 'escenario hipotético' },
      { pattern: /puedo.+(hacer|solicitar|tramitar)/, type: 'consulta específica' },
      { pattern: /diferencia entre.+/, type: 'comparación' },
      { pattern: /me ayuda.+(explicar|entender)/, type: 'explicación detallada' },
    ];
    
    for (const { pattern, type } of complexPatterns) {
      if (pattern.test(lowerPrompt)) {
        return { isComplex: true, type };
      }
    }
    
    return { isComplex: false };
  }
  
  // Optimiza el contexto para usar menos tokens
  static optimizeContext(intention: string | null): string {
    // Contexto súper minimal para ahorrar tokens
    const minimalBase = `Asistente ASADA Juan Díaz. Solo responde sobre ASADA.`;
    
    if (!intention) return minimalBase;
    
    // Contextos optimizados por intención
    const optimizedContexts: Record<string, string> = {
      organizacion: `${minimalBase} Es ${datosGenerales.DatosGenerales.descripcion}`,
      servicios: `${minimalBase} Servicio: agua potable para Juan Díaz y Oriente`,
      afiliacion: `${minimalBase} Afiliación: formulario web, cédula, documentos requeridos`,
      contacto: `${minimalBase} Contacto: ${datosGenerales.footer.contacto.telefono}`,
      pagos: `${minimalBase} Consulta pagos: número abonado + cédula en web`,
      solicitudes: `${minimalBase} Solicitudes: afiliación, cambio medidor, desconexión en web`
    };
    
    return optimizedContexts[intention] || minimalBase;
  }
  
  // Estima tokens que se usarían
  static estimateTokenUsage(prompt: string, context: string): number {
    const totalText = prompt + context + "Respuesta estimada de 100 palabras"; // Estimación
    return Math.ceil(totalText.length / 4); // ~4 chars = 1 token
  }
}