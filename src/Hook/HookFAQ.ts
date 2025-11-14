import type { FAQ } from "../models/FAQ";
import { useQuery } from "@tanstack/react-query";
import { GetAllPreguntasFrecuentes } from "../Services/FAQ/PreguntasFrecuentesService";

export const useFAQ = () => {
    return useQuery<FAQ[], Error>({
        queryKey: ['faqs'],
        queryFn: GetAllPreguntasFrecuentes,
        staleTime: 5 * 60 * 1000, // cache de 5 min
        refetchOnWindowFocus: false,
    });
};
