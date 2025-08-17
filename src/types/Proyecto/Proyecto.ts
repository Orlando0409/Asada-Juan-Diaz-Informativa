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

