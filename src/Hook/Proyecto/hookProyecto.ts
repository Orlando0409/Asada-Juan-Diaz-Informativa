// src/hooks/useProyectos.ts
import { useQuery } from "@tanstack/react-query";
import type { Proyecto } from "../../types/Proyecto/Proyecto";
import { getAllProyectos } from "../../Services/Proyectos/ProyectoService";

export const useProyectos = () => {
  return useQuery<Proyecto[]>({
    queryKey: ["proyectos"],
    queryFn: getAllProyectos,
    staleTime: 5 * 60 * 1000, // cache de 5 min
    refetchOnWindowFocus: false,
  });
};
