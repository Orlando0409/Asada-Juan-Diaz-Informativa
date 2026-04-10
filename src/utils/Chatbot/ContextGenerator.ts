import type { IntentionType } from '../../types/Chatbot';
import dataJson from '../../data/Data.json';
import chatConfig from '../../data/ChatContexto.json';

export class ContextGenerator {

  private static getBaseContext(): string {
    const { DatosGenerales, mision, vision } = dataJson;
    const { prompts_contexto } = chatConfig;
    
    return `${prompts_contexto.base}

    INFORMACIÓN BÁSICA DE LA ORGANIZACIÓN:
    - Fundada: ${DatosGenerales.añoFundacion}
    - Ubicación: ${DatosGenerales.ubicacion}
    - Servicio: ${DatosGenerales.servicios.descripcion}
    - Misión: ${mision}
    - Visión: ${vision}

    IMPORTANTE: Solo responde preguntas relacionadas con ASADA Juan Díaz y sus servicios.
    Si la pregunta no está relacionada, redirige amablemente hacia temas de la organización.
    Usa la información más actualizada del Data.json cuando esté disponible.`;
  }

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
      ubicacion: () => this.getUbicacionContext(baseContext),
      horarios: () => this.getHorariosContext(baseContext),
      sugerencias: () => this.getSugerenciasContext(baseContext),
    };

    const generator = contextGenerators[intention as keyof typeof contextGenerators];
    return generator ? generator() : baseContext;
  }

  private static getOrganizacionContext(base: string): string {
    const { DatosGenerales, historia, mision, vision } = dataJson;
    
    return `${base}

    INFORMACIÓN DETALLADA DE LA ORGANIZACIÓN:
    Descripción: ${DatosGenerales.descripcion}
    Historia: ${historia}
    Misión: ${mision}
    Visión: ${vision}

    DATOS ESPECÍFICOS:
    - Nombre completo: ${DatosGenerales.nombre}
    - Año de fundación: ${DatosGenerales.añoFundacion}
    - Ubicación exacta: ${DatosGenerales.ubicacion}
    - Servicio principal: ${DatosGenerales.servicios.descripcion}

    Responde preguntas sobre qué es la ASADA, misión, visión, historia y propósito general.`;
  }

  private static getServiciosContext(base: string): string {
    const { DatosGenerales } = dataJson;
    const calidadAguaArchivos = ((dataJson as unknown as {
      CalidadAguaArchivos?: Array<{ Titulo?: string; Titullo?: string }>;
    }).CalidadAguaArchivos ?? []);
    const { caracteristicas_servicio, cobertura_servicio } = chatConfig.respuestas_optimizadas;
    
    return `${base}

    SERVICIOS DETALLADOS:
    - Servicio principal: ${DatosGenerales.servicios.descripcion}
    - Características: ${caracteristicas_servicio.join(', ')}
    - Cobertura: ${cobertura_servicio.join(' y ')}

    CONTROL DE CALIDAD:
    Documentos disponibles (${calidadAguaArchivos.length} reportes):
    ${calidadAguaArchivos.map((archivo: { Titulo?: string; Titullo?: string }) => `- ${archivo.Titulo || archivo.Titullo}`).join('\n')}

    Responde preguntas sobre servicios, calidad del agua, cobertura y documentación de calidad.`;
  }

  private static getAfiliacionContext(base: string): string {
    const { requisitosSolicitudes } = dataJson;
    
    return `${base}

    PROCESO DE AFILIACIÓN:
    1. Completa el formulario de afiliación en el apartado de solicitudes de nuestra página web
    2. Proporciona la información personal requerida
    3. Selecciona el tipo de afiliación que necesitas
    4. Adjunta los documentos requeridos
    5. Envía la solicitud para revisión

    TIPOS DE AFILIACIÓN:
    - Afiliación como Abonado: Para personas que desean acceder a nuestros servicios de agua potable
    - Solicitud de Asociado: Para personas que desean participar activamente en la gestión de la ASADA

    REQUISITOS PARA ABONADO:
    ${Object.entries(requisitosSolicitudes.abonado).map(([_key, field]) => 
      `- ${field.label}${field.required ? ' (Obligatorio)' : ' (Opcional)'}`
    ).join('\n')}

    REQUISITOS PARA ASOCIADO:
    ${Object.entries(requisitosSolicitudes.asociado).map(([_key, field]) => 
      `- ${field.label}${field.required ? ' (Obligatorio)' : ' (Opcional)'}`
    ).join('\n')}

    Responde preguntas sobre cómo afiliarse, requisitos específicos y tipos de afiliación.`;
  }

  private static getSolicitudesContext(base: string): string {
    const { requisitosSolicitudes } = dataJson;
    
    return `${base}

    SOLICITUDES DISPONIBLES:

    1. AFILIACIÓN COMO ABONADO:
    ${Object.entries(requisitosSolicitudes.abonado).map(([_key, field]) => 
      `   - ${field.label}: ${field.type}${field.required ? ' (Requerido)' : ''}`
    ).join('\n')}

    2. CAMBIO DE MEDIDOR :
    ${Object.entries(requisitosSolicitudes.cambioMedidor).map(([_key, field]) => 
      `   - ${field.label}: ${field.type}${field.required ? ' (Requerido)' : ''}`
    ).join('\n')}

    3. DESCONEXIÓN DE MEDIDOR:
    ${Object.entries(requisitosSolicitudes.desconexion).map(([_key, field]) => 
      `   - ${field.label}: ${field.type}${field.required ? ' (Requerido)' : ''}`
    ).join('\n')}

    4. SOLICITUD DE ASOCIADO:
    ${Object.entries(requisitosSolicitudes.asociado).map(([_key, field]) => 
      `   - ${field.label}: ${field.type}${field.required ? ' (Requerido)' : ''}`
    ).join('\n')}

    Todas las solicitudes se realizan en el apartado de solicitudes de la página web.`;
  }

  private static getPagosContext(base: string): string {
    const { requisitosConsultaPagos, footer } = dataJson;
    const { metodos_pago, tipos_pago } = chatConfig.respuestas_optimizadas;
    
    return `${base}

    CONSULTA DE PAGOS:
    Consulta el estado de tus facturas utilizando tu número de medidor o cédula

    REQUISITOS:
    ${Object.entries(requisitosConsultaPagos).map(([campo, tipo]) => 
      `- ${campo}: ${tipo}`
    ).join('\n')}

    MÉTODOS DE PAGO:
    ${metodos_pago.join('\n- ')}

    TIPOS DE PAGO:
    - Mensual: ${tipos_pago.mensual}
    - Reconexión: ${tipos_pago.reconexion}
    - Mora: ${tipos_pago.mora}
    - Desconexión: ${tipos_pago.desconexion}

    CONTACTO PARA PAGOS:
    - Teléfono: ${footer.contacto.telefono}
    - Email: ${footer.contacto.correo}
    - Horario: ${footer.horarioAtencion}

    Ubicación: Sección de consulta de pagos en la página web`;
  }

  private static getContactoContext(base: string): string {
    const { footer, RequisitosContacto } = dataJson;
    
    return `${base}

    INFORMACIÓN DE CONTACTO:
    - Teléfono: ${footer.contacto.telefono}
    - Correo: ${footer.contacto.correo}
    - Horario: ${footer.horarioAtencion}
    - WhatsApp: ${footer.redesSociales.WhatsApp}

    FORMAS DE CONTACTO:
    - Queja: Para reportar problemas con el servicio, atención al cliente o facturación 
    - Reporte: Para reportar daños en tuberías, fugas, problemas de presión o calidad del agua 
    - Sugerencia: Para proponer mejoras en el servicio o nuevas ideas 

    REQUISITOS PARA FORMULARIOS:
    Reportes: ${Object.entries(RequisitosContacto.requisitosReportes).map(([_key, field]) => field.label).join(', ')}
    Quejas: ${Object.entries(RequisitosContacto.requisitosQuejas).map(([_key, field]) => field.label).join(', ')}
    Sugerencias: ${Object.entries(RequisitosContacto.requisitosSugerencias).map(([_key, field]) => field.label).join(', ')}`;
  }

  private static getProblemasContext(base: string): string {
    const { RequisitosContacto } = dataJson;
    
    return `${base}

    REPORTES Y PROBLEMAS:
    - Queja: Para reportar problemas con el servicio, atención al cliente o facturación
    - Reporte: Para reportar daños en tuberías, fugas, problemas de presión o calidad del agua 

    REQUISITOS ESPECÍFICOS:
    Para Reportes: ${Object.entries(RequisitosContacto.requisitosReportes).map(([_key, field]) => 
      `${field.label}${field.required ? ' (Obligatorio)' : ''}`
    ).join(', ')}

    Para Quejas: ${Object.entries(RequisitosContacto.requisitosQuejas).map(([_key, field]) => 
      `${field.label}${field.required ? ' (Obligatorio)' : ''}`
    ).join(', ')}

    Acceso desde la sección de Contacto en la página web.`;
  }

  private static getNavegacionContext(base: string): string {
    const { header } = dataJson;
    
    return `${base}

    NAVEGACIÓN WEB:
    ${header.navbar.menuItems.map(item => {
      if (item.subopciones) {
        return `${item.texto}: ${item.subopciones.map(sub => sub.texto).join(', ')}`;
      }
      return item.texto;
    }).join('\n')}`;
  }

  private static getUbicacionContext(base: string): string {
    const { DatosGenerales } = dataJson;
    const { cobertura_servicio } = chatConfig.respuestas_optimizadas;
    
    return `${base}

    UBICACIÓN ESPECÍFICA:
    - Dirección: ${DatosGenerales.ubicacion}
    - Área de cobertura: ${cobertura_servicio.join(' y ')}
    - Fundación: ${DatosGenerales.añoFundacion}
    - Provincia: Guanacaste, Costa Rica`;
  }

  private static getHorariosContext(base: string): string {
    const { footer } = dataJson;
    
    return `${base}

    HORARIOS DE ATENCIÓN:
    - Horario: ${footer.horarioAtencion}
    - Teléfono: ${footer.contacto.telefono}
    - Email: ${footer.contacto.correo}
    - WhatsApp: ${footer.redesSociales.WhatsApp}

    Servicios 24/7: Formularios web, información en línea`;
  }

  private static getSugerenciasContext(base: string): string {
    const { RequisitosContacto } = dataJson;
    
    return `${base}

    SUGERENCIAS:
    Para proponer mejoras en el servicio o nuevas ideas

    REQUISITOS:
    ${Object.entries(RequisitosContacto.requisitosSugerencias).map(([_key, field]) => 
      `- ${field.label}${field.required ? ' (Obligatorio)' : ' (Opcional)'}`
    ).join('\n')}

    Acceso: Formulario en sección Contacto de la página web`;
  }
}