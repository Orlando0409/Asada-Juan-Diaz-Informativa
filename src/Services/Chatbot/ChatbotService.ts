import { GeminiAPIClient } from '../../api/GeminyAPIClient';
import type { ChatResponse, IntentionType } from '../../types/Chatbot';
import { RequestAnalyzer } from '../../utils/Chatbot/RequestAnalizer';
import { FallbackResponder } from '../../utils/Chatbot/FallbackResponder';
import { IntentionDetector } from '../../utils/Chatbot/IntentionDetector';
import { TokenMonitor } from '../../utils/Chatbot/TokenMonitor';

export class ChatbotService {
  private geminiClient: GeminiAPIClient;

  constructor() {
    this.geminiClient = new GeminiAPIClient();
  }

  // Procesa un mensaje con análisis inteligente de necesidad de API
  async processMessage(prompt: string): Promise<ChatResponse> {
    try {
      //  Detectar intención
      const intention = IntentionDetector.detect(prompt);
      
      //  Analiza si usar la api o no
      const analysis = RequestAnalyzer.shouldUseAPI(prompt);
      
      if (!analysis.useAPI) {
        // Usar fallback directamente
        return this.generateOptimizedFallback(prompt, intention);
      }
      
      //  Si decide usar API, optimizar contexto
      const optimizedContext = RequestAnalyzer.optimizeContext(intention, prompt);
      const estimatedTokens = RequestAnalyzer.estimateTokenUsage(prompt, optimizedContext);
      
      //  Verificación final de tokens antes de llamar API
      const usage = TokenMonitor.getTodayStats();
      if (usage.tokens + estimatedTokens > 900000) { // 90% del límite
        return this.generateOptimizedFallback(prompt, intention);
      }
      
      //  Llamar API con contexto optimizado
      const response = await this.geminiClient.sendMessage(prompt, optimizedContext);
      
      return {
        response,
        category: intention || undefined,
        confidence: analysis.confidence
      };

    } catch (error) {
      console.error('Error procesando el mensaje:', error);
      return this.generateFallbackResponse(prompt);
    }
  }

  // Genera respuesta fallback optimizada con razón
  private generateOptimizedFallback(
    _prompt: string, 
    intention: IntentionType, 
   
  ): ChatResponse {
    const response = FallbackResponder.generateResponse(intention);
  
    
    return {
      response: response ,
      category: intention || undefined,
      confidence: 0.85
    };
  }

  //Genera respuesta fallback estándar
  private generateFallbackResponse(prompt: string): ChatResponse {
    const intention = IntentionDetector.detect(prompt);
    const response = FallbackResponder.generateResponse(intention);
    
    return {
      response,
      category: intention || undefined,
      confidence: 0.8
    };
  }
  // Obtiene estadísticas de uso
  getUsageStats() {
    return TokenMonitor.getTodayStats();
  }
}

// Exportar instancia singleton
export const chatbotService = new ChatbotService();