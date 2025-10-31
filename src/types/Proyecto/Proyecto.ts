
export interface ArchivoProyecto {
  Id_Archivo_Proyecto: number;
  Url_Archivo: string;
}


export interface UsuarioProyecto {
  Id_Usuario: number;
  Nombre_Usuario: string;
  Id_Rol: number;
  Nombre_Rol: string;
}


export interface EstadoProyecto {
  Id_Estado_Proyecto: number;
  Nombre_Estado: string;
}


export interface Proyecto {
  Id_Proyecto: number;
  Titulo: string;
  Descripcion: string;
  Fecha_Creacion: string;
  Fecha_Actualizacion: string;
  Visible: boolean;
  Imagen_Url: string;
  Estado: EstadoProyecto;
  Usuario_Creador: UsuarioProyecto;
  Archivos?: ArchivoProyecto[]; // Opcional, si manejas archivos adicionales
}

// Estado por defecto para inicializar formularios o estados
export const ProyectoDefault: Proyecto = {
  Id_Proyecto: 0,
  Titulo: '',
  Descripcion: '',
  Fecha_Creacion: '',
  Fecha_Actualizacion: '',
  Visible: false,
  Imagen_Url: '',
  Estado: {
    Id_Estado_Proyecto: 0,
    Nombre_Estado: '',
  },
  Usuario_Creador: {
    Id_Usuario: 0,
    Nombre_Usuario: '',
    Id_Rol: 0,
    Nombre_Rol: '',
  },
  Archivos: [],
};


export interface ProyectoFormData {
  Titulo: string;
  Descripcion: string;
  Imagen_url: string; 
  Id_Estado_Proyecto?: number;    // Opcional para edición
  Id_Usuario?: number;            // Opcional para edición
}