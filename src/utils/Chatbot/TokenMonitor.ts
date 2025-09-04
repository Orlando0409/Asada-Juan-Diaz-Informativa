import chatConfig from '../../data/ChatContexto.json';

export class TokenMonitor {
  private static readonly STORAGE_KEY = 'gemini_token_usage';
  
  static estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  static logTokenUsage(prompt: string, response: string) {
    const promptTokens = this.estimateTokens(prompt);
    const responseTokens = this.estimateTokens(response);
    const totalTokens = promptTokens + responseTokens;
    
    const today = new Date().toISOString().split('T')[0];
    const usage = this.getStoredUsage();
    
    if (!usage[today]) {
      usage[today] = { requests: 0, tokens: 0 };
    }
    
    usage[today].requests += 1;
    usage[today].tokens += totalTokens;
    
    // Limpiar datos antiguos (más de 7 días)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    Object.keys(usage).forEach(date => {
      if (new Date(date) < sevenDaysAgo) {
        delete usage[date];
      }
    });
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(usage));
    
  }
  
  static getTodayStats(): { requests: number; tokens: number } {
    const today = new Date().toISOString().split('T')[0];
    const usage = this.getStoredUsage();
    return usage[today] || { requests: 0, tokens: 0 };
  }
  
  static getRemainingTokens(): number {
    const { limite_tokens_diario } = chatConfig.configuracion_chatbot;
    const todayUsage = this.getTodayStats();
    return Math.max(0, limite_tokens_diario - todayUsage.tokens);
  }
  
  static isNearLimit(): boolean {
    const { limite_tokens_diario } = chatConfig.configuracion_chatbot;
    const todayUsage = this.getTodayStats();
    return todayUsage.tokens > (limite_tokens_diario * 0.8);
  }
  
  private static getStoredUsage(): Record<string, { requests: number; tokens: number }> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }
}