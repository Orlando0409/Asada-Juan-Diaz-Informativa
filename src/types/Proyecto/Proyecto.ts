export interface Proyecto {
  
  Id_Proyecto: number;
  Titulo: string;
  Descripcion: string;
  Fecha_Creacion: string;
  Fecha_Actualizacion: string;
  Id_Usuario: number;
  estado: Estado;
  Imagen_Url: string;
}

export interface Estado{
  Id_Estado_Proyecto: number;
  Nombre_Estado: string;
}

export interface ProjectCardProps {
  proyecto: Proyecto;
  isActive: boolean;
  isExpanded: boolean;
  onToggleDescription: () => void;
}

export interface CarouselControlProps {
  isPaused: boolean;
  currentIndex: number;
  totalProjects: number;
}

export interface CarouselState {
  currentIndex: number;
  isPaused: boolean;
  expandedProject: number | null;
}

