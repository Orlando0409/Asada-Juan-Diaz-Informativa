import type { Proyecto } from "../../types/Proyecto/Proyecto";
import { getAllProyectos,  } from "../../Services/Proyectos/ProyectoService";
import { useQuery } from "@tanstack/react-query";
import { getProyectosVisibles } from "../../Services/Proyectos/proyecto.service";

// Hook para obtener TODOS los proyectos (panel de administración)
export const useProyectos = () => {
  return useQuery<Proyecto[]>({
    queryKey: ["proyectos"],
    queryFn: getAllProyectos,
    staleTime: 5 * 60 * 1000, // cache de 5 min
    refetchOnWindowFocus: false,
  });
};

// Hook para obtener solo proyectos VISIBLES (vista pública)
export const useProyectosVisibles = () => {
  return useQuery<Proyecto[]>({
    queryKey: ["proyectos-visibles"],
    queryFn: getProyectosVisibles,
    staleTime: 5 * 60 * 1000, // cache de 5 min
    refetchOnWindowFocus: false,
  });
};