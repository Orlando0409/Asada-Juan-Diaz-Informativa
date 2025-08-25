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
        return `¡Hola! 👋 Bienvenido a la ${organizacion.nombreCorto}.

    Somos la Asociación Administradora de Acueducto de Juan Díaz.

    ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre afiliación, servicios, pagos o cualquier información sobre nuestra ASADA.`;
  }

  private static getOrganizacionResponse(): string {
    const { organizacion } = contextoOrganizacion;
    return `🏢 ${organizacion.nombre}

    ¿Qué somos?
    ${organizacion.descripcion}

    📍 Ubicación: ${organizacion.ubicacion}
    📅 Fundada en: ${organizacion.añoFundacion}

    ¿Te interesa conocer más sobre nuestros servicios o cómo afiliarte?`;
  }

  private static getServiciosResponse(): string {
    const { servicios } = contextoOrganizacion;
    return `💧 Nuestros Servicios

    Servicio Principal: ${servicios.principal}

    ¿Qué ofrecemos?
    ${servicios.descripcion}

    ✨ Características de nuestro servicio:
    ${servicios.caracteristicas.map(c => `• ${c}`).join('\n')}

    🌍 Cobertura: Comunidades de ${servicios.cobertura.join(' y ')}

    ¿Te interesa información específica sobre la calidad del agua o el proceso de afiliación?`;
  }

  private static getAfiliacionResponse(): string {
    const { organizacion, afiliacion } = contextoOrganizacion;
    return `💧 Afiliación a ${organizacion.nombreCorto}

    ${afiliacion.descripcion}

    📋 Proceso de afiliación:
    ${afiliacion.proceso.map((paso, index) => `${index + 1}. ${paso}`).join('\n')}

    🔗 Ubicación: ${afiliacion.ubicacion}

    🎯 Tipos de afiliación disponibles:
    ${afiliacion.tipos.map(tipo => `• ${tipo.nombre}: ${tipo.descripcion}`).join('\n')}

    Requisitos principales para abonado:
    • ${afiliacion.tipos[0].requisitos.slice(0, 4).join('\n• ')}

    ⏱️ Tiempo estimado: ${afiliacion.tipos[0].tiempoEstimado}

    ¿Te interesa algún tipo específico de afiliación?`;
  }

  private static getSolicitudesResponse(): string {
    const { solicitudes } = contextoOrganizacion;
    return `📋 Solicitudes Disponibles

    Además de la afiliación, puedes realizar estas solicitudes:

    ${solicitudes.tipos.map(tipo => 
      `🔸 ${tipo.nombre}
   ${tipo.descripcion}
   ⏱️ Tiempo: ${tipo.tiempoEstimado}
   📝 Requisitos principales: ${tipo.requisitos.slice(0, 3).join(', ')}${tipo.requisitos.length > 3 ? '...' : ''}`
    ).join('\n')}

    Todas las solicitudes se realizan a través del apartado de solicitudes en nuestra página web.

    ¿Te interesa información detallada sobre alguna solicitud específica?`;
  }

  private static getPagosResponse(): string {
    const { consultaPagos } = contextoOrganizacion;
    return `💰 Consulta de Pagos

    ${consultaPagos.descripcion}

    📋 ¿Qué necesitas para consultar?
    • ${consultaPagos.requisitos.join('\n• ')}

    🌐 ¿Dónde consultar?
    ${consultaPagos.ubicacion}

    💳 Métodos de pago disponibles:
    • ${consultaPagos.metodosPago.join('\n• ')}

    📊 Tipos de pago:
    • Mensual: ${consultaPagos.tiposPago.mensual}
    • Reconexión: ${consultaPagos.tiposPago.reconexion}
    • Mora: ${consultaPagos.tiposPago.mora}

    ¿Necesitas ayuda específica con tu consulta de pagos?`;
  }

  private static getContactoResponse(): string {
    const { contacto } = contextoOrganizacion;
    return `📞 Información de Contacto

    📱 Teléfono: ${contacto.informacion.telefono}
    📧 Email: ${contacto.informacion.correo}
    ⏰ Horario: ${contacto.informacion.horario}
    💬 WhatsApp: ${contacto.informacion.whatsapp}

    📝 Formas de contacto disponibles:
    ${contacto.formas.map(forma => 
          `• ${forma.tipo}: ${forma.descripcion}
      ⏱️ Tiempo de respuesta: ${forma.tiempoRespuesta}`
      ).join()}

    ¿Necesitas ayuda con algún tipo específico de contacto?`;
  }

  private static getUbicacionResponse(): string {
    const { organizacion, servicios } = contextoOrganizacion;
    return `📍 Ubicación de ${organizacion.nombreCorto}

    🏠 Dirección: ${organizacion.ubicacion}

    Estamos ubicados en Juan Díaz de Nicoya, en la hermosa provincia de Guanacaste, Costa Rica.

    🌍 Área de cobertura:
    Brindamos servicio de agua potable a las comunidades de ${servicios.cobertura.join(' y ')}.

    📅 Fundada en: ${organizacion.añoFundacion}

    ¿Necesitas más información sobre nuestra área de cobertura o cómo llegar a nuestras oficinas?`;
  }

  private static getHorariosResponse(): string {
    const { contacto } = contextoOrganizacion;
    return `⏰ Horarios de Atención

    🕐 Horario: ${contacto.informacion.horario}

    Durante este horario puedes:
    • Realizar consultas por teléfono
    • Enviar correos electrónicos
    • Visitar nuestras oficinas

    📞 Contacto:
    • Teléfono: ${contacto.informacion.telefono}
    • Email: ${contacto.informacion.correo}
    • WhatsApp: ${contacto.informacion.whatsapp}

    Para emergencias fuera de horario, puedes usar nuestros canales de contacto web.

    ¿Hay algo específico que necesitas resolver?`;
  }

  private static getDespedidaResponse(): string {
    const { organizacion } = contextoOrganizacion;
    return `¡Gracias por contactar a ${organizacion.nombreCorto}! 👋

    Esperamos haber resuelto tus dudas. Si necesitas más información, no dudes en contactarnos nuevamente.

    💧 Juntos cuidamos el agua, juntos cuidamos nuestra comunidad.

    ¡Que tengas un excelente día! 🌟`;
  }
}