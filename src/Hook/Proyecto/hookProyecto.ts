import { getProyectosVisibles } from "../../Services/Proyectos/ProyectoService";
import type { Proyecto } from "../../types/Proyecto/Proyecto";
import { useQuery } from "@tanstack/react-query";

// Hook para obtener solo proyectos VISIBLES (vista pública)
export const useProyectosVisibles = () => {
  return useQuery<Proyecto[]>({
    queryKey: ["proyectos-visibles"],
    queryFn: getProyectosVisibles,
    staleTime: 5 * 60 * 1000, // cache de 5 min
    refetchOnWindowFocus: false,
  });
};