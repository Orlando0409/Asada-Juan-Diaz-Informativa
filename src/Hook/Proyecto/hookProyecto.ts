import type { Proyecto } from "../../types/Proyecto/Proyecto";
import { getAllProyectos,  } from "../../Services/Proyectos/ProyectoService";
import { useQuery } from "@tanstack/react-query";


// Hook para obtener TODOS los proyectos (panel de administración)
export const useProyectos = () => {
  return useQuery<Proyecto[]>({
    queryKey: ["proyectos"],
    queryFn: getAllProyectos,
    staleTime: 5 * 60 * 1000, // cache de 5 min
    refetchOnWindowFocus: false,
  });
};
