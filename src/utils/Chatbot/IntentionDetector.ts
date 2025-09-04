import type { IntentionType } from '../../types/Chatbot';
import chatConfig from '../../data/ChatContexto.json';

export class IntentionDetector {
  
  static detect(prompt: string): IntentionType | null {
    const normalizedPrompt = this.normalizeText(prompt);
    
    // Usar keywords del ChatContexto.json
    const { keywords } = chatConfig;
    
    // Buscar intenciones en orden de prioridad
    for (const [intention, keywordList] of Object.entries(keywords)) {
      if (this.hasKeywords(normalizedPrompt, keywordList)) {
        return intention as IntentionType;
      }
    }
    
    return null;
  }

  private static normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^\w\s]/g, ' ') // Remover puntuación
      .replace(/\s+/g, ' ') // Normalizar espacios
      .trim();
  }

  private static hasKeywords(prompt: string, keywords: string[]): boolean {
    return keywords.some(keyword => {
      const normalizedKeyword = this.normalizeText(keyword);
      return prompt.includes(normalizedKeyword);
    });
  }
}