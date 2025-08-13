// src/types/Proyecto.ts
export interface Proyecto {
  
  id_Proyecto: number;
  Titulo: string;
  descripcion: string;
  fecha_Creacion: string;
  fecha_Actualizacion: string;
  Id_Usuario: number;
  estado: {
    id_Estado_Proyecto: number;
    Nombre_Estado: string;
  };
  imagenUrl: string;
}
