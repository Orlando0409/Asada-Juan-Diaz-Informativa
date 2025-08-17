import type { IntentionType } from '../../types/Chatbot';
import contextoOrganizacion from '../../data/ChatContexto.json';

export class FallbackResponder {
  
  // Genera respuestas mejoradas y más completas
  static generateResponse(intention: IntentionType): string {
    if (!intention) {
      return this.getGenericResponse();
    }

    const responses = {
      saludo: () => this.getSaludoResponse(),
      despedida: () => this.getDespedidaResponse(),
      organizacion: () => this.getOrganizacionResponse(),
      servicios: () => this.getServiciosResponse(),
      afiliacion: () => this.getAfiliacionResponse(),
      contacto: () => this.getContactoResponse(),
      pagos: () => this.getPagosResponse(),
      solicitudes: () => this.getSolicitudesResponse(),
      ubicacion: () => this.getUbicacionResponse(),
      horarios: () => this.getHorariosResponse(),
    };

    const responseGenerator = responses[intention as keyof typeof responses];
    return responseGenerator ? responseGenerator() : this.getGenericResponse();
  }

  private static getGenericResponse(): string {
    const { organizacion } = contextoOrganizacion;
    return `Hola, soy el asistente de ${organizacion.nombreCorto}. Puedo ayudarte con información sobre:
      🏢 Nuestra organización y servicios
      💧 Afiliación como abonado
      📋 Solicitudes y trámites  
      💰 Consulta de pagos
      📞 Información de contacto

      ¿Qué te interesa saber?`;
  }

  private static getSaludoResponse(): string {
    const { organizacion } = contextoOrganizacion;
    return `¡Hola! 👋 Bienvenido a ${organizacion.nombreCorto}.

    Somos la Asociación Administradora de Acueducto de Juan Díaz.
    ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre afiliación, servicios, pagos o cualquier información sobre nuestra ASADA.`;
  }

  private static getOrganizacionResponse(): string {
    const { organizacion } = contextoOrganizacion;
    return `🏢 ${organizacion.nombre}
    ¿Qué somos?
    ${organizacion.descripcion}

    Historia: ${organizacion.historia}
    Nuestra Misión: ${organizacion.mision}
    Nuestra Visión: ${organizacion.vision}
    📍 Ubicación: ${organizacion.ubicacion}
    📅 Fundada en: ${organizacion.añoFundacion}`;
  }

  private static getContactoResponse(): string {
    const { contacto } = contextoOrganizacion;
    return `📞 Información de Contacto 
    Teléfono: ${contacto.informacion.telefono} 
    Email: ${contacto.informacion.correo} 
    Horario: ${contacto.informacion.horario} 

    💬 También puedes contactarnos para:
    • Quejas sobre el servicio 
    • Reportes de daños o problemas 
    • Sugerencias de mejora 

    ¿Necesitas ayuda con algo específico?`;
  }

  private static getAfiliacionResponse(): string {
    const { organizacion, afiliacion } = contextoOrganizacion;
    return `💧 Afiliación a ${organizacion.nombreCorto}

    Proceso de afiliación:
    ${afiliacion.proceso.map((paso, index) => `${index + 1}. ${paso}`).join('\n')}

    Tipos de afiliación:
    • Abonado: Para acceso a servicios de agua potable
    • Asociado: Para participar activamente en la organización

    Requisitos principales:
    ${afiliacion.tipos[0].requisitos?.slice(0, 4).join('\n• ') || 'Ver formulario completo en nuestra página web'}

    ¿Te interesa algún tipo específico de afiliación?`;
  }

  private static getPagosResponse(): string {
    const { consultaPagos } = contextoOrganizacion;
    return `💰 Consulta de Pagos

    ${consultaPagos.descripcion}

    ¿Qué necesitas?
    • ${consultaPagos.requisitos.join('\n• ')}

    ¿Dónde consultar?
    ${consultaPagos.ubicacion}

    También puedes contactarnos directamente si tienes dudas sobre tu estado de cuenta.`;
  }

  private static getSolicitudesResponse(): string {
    const { solicitudes } = contextoOrganizacion;
    return `📋 Solicitudes Disponibles

    ${solicitudes.tipos.map(tipo => 
      `${tipo.nombre}\n${tipo.descripcion}\nRequisitos: ${tipo.requisitos.slice(0, 3).join(', ')}${tipo.requisitos.length > 3 ? '...' : ''}`
    ).join('\n\n')}

    Todas las solicitudes se realizan a través del apartado de solicitudes en nuestra página web.

    ¿Te interesa información sobre alguna solicitud específica?`;
  }

  private static getUbicacionResponse(): string {
    const { organizacion } = contextoOrganizacion;
    return `📍 Ubicación de ${organizacion.nombreCorto}

    Dirección: ${organizacion.ubicacion}

    Estamos ubicados en Juan Díaz de Nicoya, en la hermosa provincia de Guanacaste, Costa Rica.

    Brindamos servicio de agua potable a las comunidades de Juan Díaz y Oriente.

    ¿Necesitas más información sobre nuestra área de cobertura?`;
  }

  private static getHorariosResponse(): string {
    const { contacto } = contextoOrganizacion;
    return `⏰ Horarios de Atención

    Horario: ${contacto.informacion.horario}

    Durante este horario puedes: \n
    • Realizar consultas por teléfono \n
    • Enviar correos electrónicos \n
    • Visitar nuestras oficinas \n

    Para emergencias fuera de horario, puedes usar nuestros canales de contacto web.

    ¿Hay algo específico que necesitas resolver?`;
  }

  private static getServiciosResponse(): string {
    const { servicios } = contextoOrganizacion;
    return `💧 Nuestros Servicios

    Servicio Principal: ${servicios.principal}

    ¿Qué ofrecemos?
    ${servicios.descripcion}

    Características de nuestro servicio:
    ${servicios.caracteristicas.map(c => `• ${c}`).join('\n')}

    Cobertura: Comunidades de ${servicios.cobertura.join(' y ')}

    ¿Te interesa información específica sobre la calidad del agua o el proceso de afiliación?`;
  }

  private static getDespedidaResponse(): string {
    const { organizacion } = contextoOrganizacion;
    return `¡Gracias por contactar a ${organizacion.nombreCorto}! 👋

    Esperamos haber resuelto tus dudas. Si necesitas más información, no dudes en contactarnos nuevamente.
    💧 Juntos cuidamos el agua, juntos cuidamos nuestra comunidad.
    ¡Que tengas un excelente día! 🌟`;
  }
}