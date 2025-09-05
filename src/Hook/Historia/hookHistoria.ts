import { useQuery } from "@tanstack/react-query";
import type { Historia } from "../../models/Historia/Historia";
import { getAllHistoria } from "../../Services/Historia/HistoriaService";

export const useHistorias = () => {
  return useQuery<Historia[], Error>({
    queryKey: ["historias"],
    queryFn: getAllHistoria,
    staleTime: 5 * 60 * 1000, // 5 minutos antes de volver a refrescar
    retry: 1, // intentará 1 vez más si falla
  });
};