import type { IntentionType } from '../../types/Chatbot';
import contextoOrganizacion from '../../data/ChatContexto.json';

// Detecta la intención del usuario basándose en palabras clave

export class IntentionDetector {
  
  /**
   * Detecta la intención principal del prompt del usuario
   * @param prompt - Mensaje del usuario
   * @returns La intención detectada o null si no se encuentra
   */
  static detect(prompt: string): IntentionType {
    const normalizedPrompt = this.normalizeText(prompt);
    
    for (const [categoria, keywords] of Object.entries(contextoOrganizacion.keywords)) {
      if (this.hasKeywords(normalizedPrompt, keywords)) {
        return categoria as IntentionType;
      }
    }
    
    return null;
  }

  // Normaliza el texto para comparación
  private static normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .trim();
  }

  // Verifica si el prompt contiene alguna de las palabras clave
  private static hasKeywords(prompt: string, keywords: string[]): boolean {
    return keywords.some(keyword => 
      prompt.includes(this.normalizeText(keyword))
    );
  }

  // Obtiene el score de confianza de la intención detectada
  static getConfidenceScore(prompt: string, intention: IntentionType): number {
    if (!intention) return 0;
    
    const keywords = contextoOrganizacion.keywords[intention];
    if (!keywords) return 0;

    const normalizedPrompt = this.normalizeText(prompt);
    const matchingKeywords = keywords.filter(keyword =>
      normalizedPrompt.includes(this.normalizeText(keyword))
    );

    return Math.min(0.9, matchingKeywords.length * 0.3);
  }
}