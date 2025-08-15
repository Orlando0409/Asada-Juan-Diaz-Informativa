export interface ChatRequest {
  prompt: string;
  context?: string;
}

export interface ChatResponse {
  response: string;
  category?: string;
  confidence?: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  category?: string;
  confidence?: number;
}

export interface ChatError {
  message: string;
  isAPIError?: boolean;
}

export type IntentionType = 
  | 'saludo' 
  | 'despedida' 
  | 'organizacion' 
  | 'servicios' 
  | 'afiliacion' 
  | 'solicitudes' 
  | 'pagos' 
  | 'contacto' 
  | 'problemas' 
  | 'sugerencias' 
  | 'navegacion' 
  | 'ubicacion' 
  | 'horarios'
  | null;

export interface OrganizacionContexto {
  organizacion: {
    nombre: string;
    nombreCorto: string;
    descripcion: string;
    mision: string;
    vision: string;
    ubicacion: string;
    añoFundacion: number;
    historia: string;
  }
  servicios: {
    principal: string;
    descripcion: string;
    caracteristicas: string[];
    cobertura: string[];
  };
}