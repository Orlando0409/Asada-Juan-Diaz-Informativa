import { IntentionDetector } from './IntentionDetector';
import { TokenMonitor } from './TokenMonitor';
import chatConfig from '../../data/ChatContexto.json';

export class RequestAnalyzer {
  
  static shouldUseAPI(prompt: string): {
    useAPI: boolean;
    reason: string;
    confidence: number;
  } {
    
    // Verificar límites desde configuración
    const { configuracion_chatbot } = chatConfig;
    const usage = TokenMonitor.getTodayStats();
    
    if (usage.tokens > configuracion_chatbot.limite_tokens_diario * 0.9) {
      return {
        useAPI: false,
        reason: 'Límite diario crítico de tokens alcanzado',
        confidence: 0.95
      };
    }
    
    // Detectar intención
    const intention = IntentionDetector.detect(prompt);
    
    // Verificar contextos especiales
    const { contextos_especiales } = chatConfig;
    
    // Detectar emergencias
    const isEmergency = contextos_especiales.emergencia.keywords.some(
      keyword => prompt.toLowerCase().includes(keyword)
    );
    
    if (isEmergency) {
      return {
        useAPI: false,
        reason: 'Respuesta de emergencia rápida',
        confidence: 0.9
      };
    }
    
    // Solo usar fallback para saludos/despedidas muy básicos
    const basicIntentions = ['saludo', 'despedida'];
    const isBasicGreeting = basicIntentions.includes(intention as string) && 
                           prompt.trim().length < 10;
    
    if (isBasicGreeting) {
      return {
        useAPI: false,
        reason: `Saludo/despedida básico: ${intention}`,
        confidence: 0.85
      };
    }
    
    // Detectar spam obvio
    if (this.isObviousSpam(prompt)) {
      return {
        useAPI: false,
        reason: 'Spam detectado',
        confidence: 0.9
      };
    }
    
    // Usar patrones de intención para análisis
    const { patrones_intencion } = chatConfig;
    const isPreguntaDirecta = patrones_intencion.pregunta_directa.some(
      patron => prompt.toLowerCase().includes(patron)
    );
    
    if (isPreguntaDirecta) {
      return {
        useAPI: true,
        reason: 'Pregunta directa detectada',
        confidence: 0.8
      };
    }
    
    // Para lo demás, usar configuración por defecto
    const confidence = this.calculateAPIConfidence(prompt, intention);
    
    return {
      useAPI: configuracion_chatbot.usar_gemini_por_defecto,
      reason: intention ? 
        `Pregunta sobre ${intention} - API recomendada` : 
        'Pregunta compleja - API recomendada',
      confidence
    };
  }
  
  private static calculateAPIConfidence(prompt: string, intention: string | null): number {
    let confidence = 0.7; // Base confidence
    
    if (intention) confidence += 0.1;
    if (prompt.length > 20) confidence += 0.1;
    if (/[¿?]/.test(prompt) || /^(cómo|como|qué|que|cuál|cual|dónde|donde|cuándo|cuando|por qué|porque)/.test(prompt.toLowerCase())) {
      confidence += 0.1;
    }
    
    return Math.min(0.95, confidence);
  }
  
  private static isObviousSpam(prompt: string): boolean {
    const lowerPrompt = prompt.toLowerCase().trim();
    
    const spamPatterns = [
      /^(.)\1{15,}$/, // Muchos caracteres repetidos
      /^[^\w\s]*$/, // Solo símbolos
      /(.{1,5})\1{8,}/, // Patrones muy repetitivos
      /^(test|testing|prueba)\s*$/i, // Palabras de prueba solas
      /^[aeiou123]\s*$/i, // Caracteres únicos
    ];
    
    return spamPatterns.some(pattern => pattern.test(lowerPrompt));
  }
  
  static optimizeContext(intention: string | null, _prompt: string): string {
    const { prompts_contexto } = chatConfig;
    
    // Contexto base desde configuración
    let context = prompts_contexto.base;
    
    // Agregar contexto específico si existe
    if (intention && prompts_contexto.especificos[intention as keyof typeof prompts_contexto.especificos]) {
      context += `\n\nENFOQUE: ${prompts_contexto.especificos[intention as keyof typeof prompts_contexto.especificos]}`;
    }
    
    return context;
  }
  
  static estimateTokenUsage(prompt: string, context: string): number {
    const promptTokens = Math.ceil(prompt.length / 4);
    const contextTokens = Math.ceil(context.length / 4);
    const responseTokens = 75;
    
    return promptTokens + contextTokens + responseTokens;
  }
}