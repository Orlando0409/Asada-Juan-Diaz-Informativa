import type { IntentionType } from '../../types/Chatbot';
import dataJson from '../../data/Data.json';
import chatConfig from '../../data/ChatContexto.json';

export class FallbackResponder {
  
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
      problemas: () => this.getProblemasResponse(),
      sugerencias: () => this.getSugerenciasResponse(),
      navegacion: () => this.getNavegacionResponse(),
    };

    const responseGenerator = responses[intention];
    return responseGenerator ? responseGenerator() : this.getGenericResponse();
  }

  private static getGenericResponse(): string {
    const { DatosGenerales } = dataJson;
    return `¡Hola! 👋 Soy el asistente virtual de ${DatosGenerales.nombre}.

    ${DatosGenerales.descripcion}

    🏠 ¿Qué puedo ayudarte a encontrar?

    💧 Servicios y Afiliación
    • Cómo afiliarte como abonado o asociado
    • Información sobre nuestros servicios
    • Requisitos y documentos necesarios

    📋 Solicitudes y Trámites
    • Afiliación de nuevos abonados
    • Cambio de medidor
    • Desconexión de servicio
    • Solicitud de asociado

    💰 Consultas
    • Estado de pagos y facturas
    • Métodos de pago disponibles

    📞 Contacto e Información
    • Datos de contacto y ubicación
    • Horarios de atención
    • Reportes y sugerencias

    ¿Sobre qué tema específico te gustaría conocer más?`;
  }

  private static getSaludoResponse(): string {
    const { respuestas_rapidas } = chatConfig;
    const respuestas = respuestas_rapidas.saludo_basico;
    return respuestas[Math.floor(Math.random() * respuestas.length)];
  }

  private static getDespedidaResponse(): string {
    const { DatosGenerales, footer } = dataJson;
    return `¡Gracias por contactar a ${DatosGenerales.nombre}! 👋

    Esperamos haber resuelto tus dudas. Si necesitas más información, nuestros canales están disponibles:

    📞 Teléfono: ${footer.contacto.telefono}
    📧 Email: ${footer.contacto.correo}
    ⏰ Horario: ${footer.horarioAtencion}
    💬 WhatsApp: ${footer.redesSociales.WhatsApp}

    💧 "Juntos cuidamos el agua, juntos cuidamos nuestra comunidad"

    ¡Que tengas un excelente día! 🌟`;
  }

  private static getOrganizacionResponse(): string {
    const { DatosGenerales, mision, vision, historia } = dataJson;
    return `🏢 ${DatosGenerales.nombre}

    ¿Quiénes somos?
    ${DatosGenerales.descripcion}

    🎯 Misión:
    ${mision}

    🌟 Visión:
    ${vision}

    📍 Información General:
    • Ubicación: ${DatosGenerales.ubicacion}
    • Fundada en: ${DatosGenerales.añoFundacion}
    • Servicio Principal: ${DatosGenerales.servicios.descripcion}

    🌍 Nuestra Historia:
    ${historia.substring(0, 200)}...

    ¿Te interesa conocer más sobre nuestra historia completa, servicios específicos o el proceso de afiliación?`;
  }

  private static getServiciosResponse(): string {
    const { DatosGenerales } = dataJson;
    const calidadAguaArchivos = ((dataJson as unknown as {
      CalidadAguaArchivos?: Array<unknown>;
    }).CalidadAguaArchivos ?? []);
    const { caracteristicas_servicio, cobertura_servicio } = chatConfig.respuestas_optimizadas;
    
    return `💧 Nuestros Servicios

    Servicio Principal: ${DatosGenerales.servicios.descripcion}

    ✨ Características de nuestro servicio:
    ${caracteristicas_servicio.map(c => `• ${c}`).join('\n')}

    🌍 Cobertura: Comunidades de ${cobertura_servicio.join(' y ')}

    📊 Control de Calidad:
    Contamos con ${calidadAguaArchivos.length}+ reportes de calidad del agua actualizados.

    🔧 Servicios Adicionales:
    • Instalación de medidores
    • Mantenimiento de infraestructura
    • Control de calidad continuo
    • Atención al cliente

    ¿Te interesa información específica sobre la calidad del agua o el proceso de afiliación para acceder a nuestros servicios?`;
  }

  private static getAfiliacionResponse(): string {
    const { requisitosSolicitudes } = dataJson;
    
    return `💧 Afiliación a ASADA Juan Díaz

    📋 Proceso de afiliación:
    1. Completa el formulario de afiliación en el apartado de solicitudes de nuestra página web
    2. Proporciona la información personal requerida
    3. Selecciona el tipo de afiliación que necesitas
    4. Adjunta los documentos requeridos
    5. Envía la solicitud para revisión

    🎯 Tipos de afiliación disponibles:

    🏠 Abonado (Servicio de Agua):
    • Para acceder a nuestros servicios de agua potable

    👥 Asociado (Participación Activa):
    • Para participar en la gestión de la ASADA

    📝 Requisitos para Abonado:
    ${Object.entries(requisitosSolicitudes.abonado).map(([_key, field]) => 
      `• ${field.label}${field.required ? ' (Obligatorio)' : ' (Opcional)'}`
    ).join('\n')}

    🌐 Ubicación: Apartado de solicitudes en la página web

    ¿Te interesa información específica sobre algún tipo de afiliación o necesitas ayuda con los requisitos?`;
  }

  private static getSolicitudesResponse(): string {
    const { requisitosSolicitudes } = dataJson;
    
    const tiposSolicitudes = {
      abonado: 'Afiliación como Abonado',
      cambioMedidor: 'Cambio de Medidor',
      desconexion: 'Desconexión de Medidor',
      asociado: 'Solicitud de Asociado'
    };

    return `📋 Solicitudes Disponibles

    Formularios disponibles en nuestra página web:

    ${Object.entries(tiposSolicitudes).map(([tipo, nombre]) => {
      const campos = requisitosSolicitudes[tipo as keyof typeof requisitosSolicitudes];
      const cantidadCampos = Object.keys(campos).length;
      
      return `🔸 ${nombre}
      📝 Campos requeridos: ${cantidadCampos}
      📁 Documentos: ${Object.values(campos).filter(campo => campo.type === 'file').length > 0 ? 'Sí requiere' : 'No requiere'}}`;
    })}

    🌐 Acceso: Todas las solicitudes se realizan a través del apartado de solicitudes en nuestra página web.

    ¿Te interesa información detallada sobre alguna solicitud específica?`;
  }

  private static getPagosResponse(): string {
    const { requisitosConsultaPagos, footer } = dataJson;
    const { metodos_pago, tipos_pago } = chatConfig.respuestas_optimizadas;
    
    return `💰 Consulta de Pagos

    Consulta el estado de tus pagos y facturas utilizando tu número de abonado y cédula

    📋 Requisitos para consultar:
    ${Object.entries(requisitosConsultaPagos).map(([campo, _tipo]) => 
      `• ${campo}`
    )}

    🌐 Ubicación: Sección de consulta de pagos en la página web

    💳 Métodos de pago disponibles:
    ${metodos_pago.map(metodo => `• ${metodo}`)}

    📊 Tipos de pago:
    • Mensual: ${tipos_pago.mensual}
    • Reconexión: ${tipos_pago.reconexion}
    • Mora: ${tipos_pago.mora}

    📞 Contacto para consultas:
    • Teléfono: ${footer.contacto.telefono}
    • Email: ${footer.contacto.correo}
    • Horario: ${footer.horarioAtencion}

    ¿Necesitas ayuda específica con tu consulta de pagos?`;
  }

  private static getContactoResponse(): string {
    const { footer } = dataJson;
    
    return `📞 Información de Contacto

    📱 Datos de Contacto:
    • Teléfono: ${footer.contacto.telefono}
    • Email: ${footer.contacto.correo}
    • Horario: ${footer.horarioAtencion}
    • WhatsApp: ${footer.redesSociales.WhatsApp}

    📝 Formas de contacto disponibles:

    🔸 Quejas
      Para reportar problemas con el servicio, atención al cliente o facturación

    🔸 Reportes
      Para reportar daños en tuberías, fugas, problemas de presión o calidad del agua
      
    🔸 Sugerencias
      Para proponer mejoras en el servicio o nuevas ideas

    🌐 Acceso: Puedes acceder a los formularios desde la sección de Contacto en nuestra página web.

    ¿Necesitas ayuda con algún tipo específico de contacto o formulario?`;
  }

  private static getUbicacionResponse(): string {
    const { DatosGenerales } = dataJson;
    const { cobertura_servicio } = chatConfig.respuestas_optimizadas;
    
    return `📍 Ubicación de ASADA Juan Díaz

    🏠 Dirección: ${DatosGenerales.ubicacion}

    Estamos ubicados en Juan Díaz de Nicoya, en la hermosa provincia de Guanacaste, Costa Rica.

    🌍 Área de cobertura:
    Brindamos servicio de agua potable a las comunidades de ${cobertura_servicio.join(' y ')}.

    📅 Historia: Fundada en ${DatosGenerales.añoFundacion}

    🎯 Nuestra misión en la comunidad:
    ${DatosGenerales.descripcion}

    ¿Necesitas más información sobre nuestra área de cobertura o cómo llegar a nuestras oficinas?`;
  }

  private static getHorariosResponse(): string {
    const { footer } = dataJson;
    
    return `⏰ Horarios de Atención

    🕐 Horario: ${footer.horarioAtencion}

    📞 Contacto durante horario de atención:
    • Teléfono: ${footer.contacto.telefono}
    • Email: ${footer.contacto.correo}
    • WhatsApp: ${footer.redesSociales.WhatsApp}

    🌐 Servicios disponibles 24/7:
    • Formularios web (solicitudes, consultas, contacto)
    • Información en nuestra página web 

    ⚡ Para emergencias:
    Puedes usar nuestros canales de contacto web o WhatsApp

    ¿Hay algo específico que necesitas resolver durante nuestro horario de atención?`;
  }

  private static getProblemasResponse(): string {
    const { RequisitosContacto } = dataJson;
    
    return `🚨 Reportes y Problemas

    Para reportar problemas puedes usar:

    🔸 Reportes (Daños técnicos):
    Para reportar daños en tuberías, fugas, problemas de presión o calidad del agua

    📝 Requisitos para reportes:
    ${Object.entries(RequisitosContacto.requisitosReportes).map(([_key, field]) => 
      `• ${field.label}${field.required ? ' (Obligatorio)' : ' (Opcional)'}`
    )}

    🔸 Quejas (Atención al cliente):
    Para reportar problemas con el servicio, atención al cliente o facturación

    🌐 Acceso: Sección de Contacto en nuestra página web

    ¿Necesitas reportar algún problema específico o tienes alguna queja sobre nuestro servicio?`;
  }

  private static getSugerenciasResponse(): string {
    const { RequisitosContacto } = dataJson;
    
    return `💡 Sugerencias y Mejoras

    Para proponer mejoras en el servicio o nuevas ideas

    📝 Requisitos para sugerencias:
    ${Object.entries(RequisitosContacto.requisitosSugerencias).map(([_key, field]) => 
      `• ${field.label}${field.required ? ' (Obligatorio)' : ' (Opcional)'}`
    )}

    🌐 Acceso: Formulario de sugerencias en la sección de Contacto de nuestra página web

    🎯 Tipos de sugerencias que valoramos:
    • Mejoras en el servicio de agua
    • Optimización de procesos
    • Nuevas iniciativas comunitarias
    • Mejoras en infraestructura
    • Sugerencias ambientales

    ¿Tienes alguna idea específica que te gustaría compartir con nosotros?`;
  }

  private static getNavegacionResponse(): string {
    const { header } = dataJson;
    
    return `🧭 Navegación en nuestra página web

    📱 Secciones principales disponibles:

    ${header.navbar.menuItems.map(item => {
      if (item.subopciones) {
        return '🔸 ' + item.texto  + item.subopciones.map(sub => '• ' + sub.texto);
      } else {
        return '🔸' + item.texto + '';
      }
    })}

    🎯 Funcionalidades especiales:
    • Formularios interactivos para solicitudes
    • Consulta de pagos en línea
    • Descarga de documentos de calidad del agua
    • Chat en vivo para consultas

    ¿Necesitas ayuda para encontrar alguna sección específica?`;
  }

  static getEmergencyResponse(): string {
    const { contextos_especiales } = chatConfig;
    const { footer } = dataJson;
    
    return contextos_especiales.emergencia.respuesta_rapida
      .replace('teléfono de la ASADA', footer.contacto.telefono);
  }
}