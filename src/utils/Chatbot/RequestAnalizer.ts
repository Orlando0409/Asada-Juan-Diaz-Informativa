import { IntentionDetector } from './IntentionDetector';
import { TokenMonitor } from './TokenMonitor';
import contextoOrganizacion from '../../data/ChatContexto.json';

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
      { pattern: /^(adiós|adios|bye|gracias|chao)/, type: 'despedida' },
      { pattern: /^(que es|qué es).+(asada|organización|organizacion)/, type: 'definición básica' },
      { pattern: /^(dónde|donde).+(ubicación|ubicacion|dirección|direccion)/, type: 'ubicación' },
      { pattern: /^(cuál|cual).+(teléfono|telefono|correo|contacto)/, type: 'contacto básico' },
      { pattern: /^(cuándo|cuando).+(horario|atienden)/, type: 'horarios' },
      { pattern: /^(misión|mision|visión|vision)/, type: 'información institucional' },
      { pattern: /^(historia|fundación|fundacion|creación|creacion)/, type: 'historia' },
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
      { pattern: /como.+(proceso|procedimiento|pasos).+(detallado|específico|especifico)/, type: 'proceso detallado' },
      { pattern: /cuáles.+(requisitos|documentos|necesito).+(exactos|específicos|especificos)/, type: 'requisitos específicos' },
      { pattern: /qué pasa si.+/, type: 'escenario hipotético' },
      { pattern: /puedo.+(hacer|solicitar|tramitar).+si.+/, type: 'consulta condicional' },
      { pattern: /diferencia entre.+/, type: 'comparación' },
      { pattern: /me ayuda.+(explicar|entender).+porque.+/, type: 'explicación detallada' },
      { pattern: /(problema|falla|daño|avería|averia).+(específico|especifico|complejo)/, type: 'problema complejo' },
      { pattern: /varios.+(pasos|requisitos|documentos)/, type: 'múltiples elementos' },
    ];
    
    for (const { pattern, type } of complexPatterns) {
      if (pattern.test(lowerPrompt)) {
        return { isComplex: true, type };
      }
    }
    
    // Detectar preguntas largas (probablemente complejas)
    if (prompt.split(' ').length > 15) {
      return { isComplex: true, type: 'pregunta extensa' };
    }
    
    return { isComplex: false };
  }
  
  // Optimiza el contexto para usar menos tokens

  static optimizeContext(intention: string | null, _prompt: string): string {
    const org = contextoOrganizacion.organizacion;
    
    // Contexto súper minimal para ahorrar tokens
    const minimalBase = `Asistente de ${org.nombreCorto}. 
    ${org.descripcion}
        Solo responde sobre ASADA Juan Díaz.
        Sé conciso pero informativo.`;
    
    if (!intention) return minimalBase;
    
    // Contextos optimizados por intención
    const optimizedContexts: Record<string, string> = {
      organizacion: `${minimalBase}
        Misión: ${org.mision}
        Historia: Fundada en ${org.añoFundacion} para agua potable comunitaria.`,
            
      servicios: `${minimalBase}
        Servicio: Agua potable de calidad para Juan Díaz y Oriente.
        Características: Eficiente, sostenible, control de calidad garantizado.`,
            
      afiliacion: `${minimalBase}
        Afiliación: Formulario web con cédula, documentos del terreno.
        Tipos: Abonado (servicios) y Asociado (participación activa).
        Proceso: ${contextoOrganizacion.afiliacion?.proceso?.slice(0, 3).join('. ') || 'Completar formulario en web'}.`,
            
      contacto: `${minimalBase}
        Contacto: ${contextoOrganizacion.contacto?.informacion?.telefono || 'Ver página web'}
        Email: ${contextoOrganizacion.contacto?.informacion?.correo || 'Ver página web'}
        Horario: ${contextoOrganizacion.contacto?.informacion?.horario || 'Lunes a Viernes'}`,
            
      pagos: `${minimalBase}
        Consulta pagos: Ingresa número de abonado + cédula en sección web.
        Ubicación: ${contextoOrganizacion.consultaPagos?.ubicacion || 'Página web'}.`,
            
      solicitudes: `${minimalBase}
        Solicitudes web: Afiliación, cambio medidor, desconexión.
        Requisitos varían según tipo. Documentos necesarios en formularios.`
    };
    
    return optimizedContexts[intention] || minimalBase;
  }
  
  //Estima tokens que se usarían
  static estimateTokenUsage(prompt: string, context: string): number {
    // Estimación: prompt + context + respuesta estimada
    const promptTokens = Math.ceil(prompt.length / 4);
    const contextTokens = Math.ceil(context.length / 4);
    const responseTokens = 50; // Respuesta estimada de ~200 caracteres
    
    return promptTokens + contextTokens + responseTokens;
  }
  
  //* Verifica patrones de spam o preguntas repetitivas
  static isSpamOrRepetitive(prompt: string): boolean {
    const lowerPrompt = prompt.toLowerCase().trim();
    
    // Detectar patrones de spam
    const spamPatterns = [
      /^(.)\1{10,}$/, // Caracteres repetidos
      /^(test|testing|prueba|hola)\s*$/, // Palabras de prueba solas
      /^[^\w\s]*$/, // Solo símbolos
      /(.{1,10})\1{5,}/ // Patrones repetitivos cortos
    ];
    
    return spamPatterns.some(pattern => pattern.test(lowerPrompt));
  }
  
  //Analiza la calidad de la pregunta
  static analyzeQuestionQuality(prompt: string): {
    quality: 'high' | 'medium' | 'low';
    score: number;
    factors: string[];
  } {
    const factors: string[] = [];
    let score = 0;
    
    // Longitud adecuada
    if (prompt.length >= 10 && prompt.length <= 200) {
      score += 20;
      factors.push('Longitud adecuada');
    }
    
    // Tiene palabras clave relacionadas con ASADA
    const relevantKeywords = ['asada', 'agua', 'afilia', 'pago', 'servicio', 'solicitud'];
    if (relevantKeywords.some(keyword => prompt.toLowerCase().includes(keyword))) {
      score += 30;
      factors.push('Relevante a ASADA');
    }
    
    // Está bien formada (tiene signos de interrogación, etc.)
    if (/[¿?]/.test(prompt) || /^(cómo|como|qué|que|cuál|cual|dónde|donde|cuándo|cuando)/.test(prompt.toLowerCase())) {
      score += 25;
      factors.push('Bien formada');
    }
    
    // No es spam
    if (!this.isSpamOrRepetitive(prompt)) {
      score += 25;
      factors.push('No spam');
    }
    
    let quality: 'high' | 'medium' | 'low';
    if (score >= 80) quality = 'high';
    else if (score >= 50) quality = 'medium';
    else quality = 'low';
    
    return { quality, score, factors };
  }
}