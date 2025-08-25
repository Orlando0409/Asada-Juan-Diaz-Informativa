export class TokenMonitor {
  private static readonly STORAGE_KEY = 'gemini_token_usage';
  
  // Estima tokens de un texto (aproximado)
  static estimateTokens(text: string): number {
    // Regla aproximada: ~4 caracteres = 1 token
    return Math.ceil(text.length / 4);
  }

  // Registra uso de tokens
  static logTokenUsage(prompt: string, response: string) {
    const promptTokens = this.estimateTokens(prompt);
    const responseTokens = this.estimateTokens(response);
    const totalTokens = promptTokens + responseTokens;
    
    const usage = this.getStoredUsage();
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    if (!usage[today]) {
      usage[today] = { requests: 0, tokens: 0 };
    }
    
    usage[today].requests += 1;
    usage[today].tokens += totalTokens;
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(usage));
    
    
    return { promptTokens, responseTokens, totalTokens, dailyTotal: usage[today].tokens };
  }
  
  // Obtiene uso almacenado
  private static getStoredUsage(): Record<string, { requests: number; tokens: number }> {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  }
  
  // Obtiene estadísticas del día actual
  static getTodayStats() {
    const usage = this.getStoredUsage();
    const today = new Date().toISOString().split('T')[0];
    return usage[today] || { requests: 0, tokens: 0 };
  }
  
  // Limpia datos antiguos
   
  static cleanup() {
    const usage = this.getStoredUsage();
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const cleaned = Object.fromEntries(
      Object.entries(usage).filter(([date]) => 
        new Date(date) >= sevenDaysAgo
      )
    );
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cleaned));
  }
}