import type { IntentionType } from '../../types/Chatbot';
import contextoOrganizacion from '../../data/ChatContexto.json';

//Genera contextos específicos según la intención detectada
export class ContextGenerator {

  // Genera el contexto base de la organización
  private static getBaseContext(): string {
    const { organizacion } = contextoOrganizacion;
    
    return `Eres el asistente virtual de ${organizacion.nombre} (${organizacion.nombreCorto}).

    INFORMACIÓN CLAVE:
    - Fundada en: ${organizacion.añoFundacion}
    - Ubicación: ${organizacion.ubicacion}
    - Servicio principal: Agua potable para Juan Díaz y Oriente
    - Misión: ${organizacion.mision}
    - Visión: ${organizacion.vision}

    IMPORTANTE: Solo responde preguntas relacionadas con ${organizacion.nombreCorto} y sus servicios.
    Si la pregunta no está relacionada, redirige amablemente hacia temas de la organización.`;
  }

  // Genera contexto específico según la intención
  static generate(intention: IntentionType): string {
    const baseContext = this.getBaseContext();
    
    if (!intention) return baseContext;

    const contextGenerators = {
      organizacion: () => this.getOrganizacionContext(baseContext),
      servicios: () => this.getServiciosContext(baseContext),
      afiliacion: () => this.getAfiliacionContext(baseContext),
      solicitudes: () => this.getSolicitudesContext(baseContext),
      pagos: () => this.getPagosContext(baseContext),
      contacto: () => this.getContactoContext(baseContext),
      problemas: () => this.getProblemasContext(baseContext),
      navegacion: () => this.getNavegacionContext(baseContext),
    };

    const generator = contextGenerators[intention as keyof typeof contextGenerators];
    return generator ? generator() : baseContext;
  }

  private static getOrganizacionContext(base: string): string {
    const { organizacion } = contextoOrganizacion;
    
    return `${base}

    INFORMACIÓN DETALLADA:
    ${organizacion.descripcion}

    Historia: ${organizacion.historia}

    Responde preguntas sobre qué es ${organizacion.nombreCorto}, misión, visión, historia y propósito general.`;
  }

  private static getServiciosContext(base: string): string {
    const { servicios } = contextoOrganizacion;
    
    return `${base}

    SERVICIOS:
    - Servicio principal: ${servicios.principal}
    - Descripción: ${servicios.descripcion}
    - Características: ${servicios.caracteristicas.join(', ')}
    - Cobertura: ${servicios.cobertura.join(' y ')}

    Responde preguntas sobre servicios, calidad del agua y cobertura.`;
  }

  private static getAfiliacionContext(base: string): string {
    const { afiliacion } = contextoOrganizacion;
    
    return `${base}

    PROCESO DE AFILIACIÓN:
      ${afiliacion.proceso.map((paso, index) => `${index + 1}. ${paso}`).join('\n')}

    TIPOS DE AFILIACIÓN:
      ${afiliacion.tipos.map(tipo => `- ${tipo.nombre}: ${tipo.descripcion}`).join('\n')}

    REQUISITOS PARA ABONADO:
      ${afiliacion.tipos[0].requisitos?.join('\n')}

    Responde preguntas sobre cómo afiliarse, requisitos y tipos de afiliación.`;
  }

  private static getSolicitudesContext(base: string): string {
    const { solicitudes } = contextoOrganizacion;
    
    return `${base}

    TIPOS DE SOLICITUDES DISPONIBLES:
    ${solicitudes.tipos.map(tipo => 
      `- ${tipo.nombre}: ${tipo.descripcion}\n  Requisitos: ${tipo.requisitos.join(', ')}`
    ).join('\n')}

    Todas las solicitudes se realizan en el apartado de solicitudes de la página web.`;
  }

  private static getPagosContext(base: string): string {
    const { consultaPagos } = contextoOrganizacion;
    
    return `${base}

    CONSULTA DE PAGOS:
    ${consultaPagos.descripcion}

    Requisitos: ${consultaPagos.requisitos.join(' y ')}

    Ubicación: ${consultaPagos.ubicacion}`;
  }

  private static getContactoContext(base: string): string {
    const { contacto } = contextoOrganizacion;
    
    const formasContacto = contacto.formas.map(forma => `- ${forma.tipo}: ${forma.descripcion}`).join('\n');
    
    return `${base}

    INFORMACIÓN DE CONTACTO:
    - Teléfono: ${contacto.informacion.telefono}
    - Correo: ${contacto.informacion.correo}
    - Horario: ${contacto.informacion.horario}
    - WhatsApp: Disponible

    FORMAS DE CONTACTO:
    ${formasContacto}`;
  }

  private static getProblemasContext(base: string): string {
    const { contacto } = contextoOrganizacion;
    
    return `${base}

    Para reportar problemas, quejas o reportes:
    ${contacto.formas.filter(f => f.tipo === 'Queja' || f.tipo === 'Reporte')
      .map(forma => `- ${forma.tipo}: ${forma.descripcion}`)
      .join('\n')}

    Puedes acceder desde la sección de Contacto en la página web.`;
  }

  private static getNavegacionContext(base: string): string {
    const { navegacion } = contextoOrganizacion;
    
    return `${base}

    SECCIONES DE LA PÁGINA WEB:
    ${navegacion.secciones.map(seccion => {
      const subseccionesText = seccion.subsecciones ? ` (${seccion.subsecciones.join(', ')})` : '';
      return `- ${seccion.nombre}${subseccionesText}`;
    }).join('\n')}`;
  }
}