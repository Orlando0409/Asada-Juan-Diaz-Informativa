import { useQuery } from "@tanstack/react-query";

import type { Imagen } from "../../models/Historia/Historia";
import { getImagenes } from "../../Services/Historia/HistoriaService";

export const useImagenesPublic = () => {
  return useQuery<Imagen[], Error>({
    queryKey: ["imagenesPublic"],
    queryFn: getImagenes,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};