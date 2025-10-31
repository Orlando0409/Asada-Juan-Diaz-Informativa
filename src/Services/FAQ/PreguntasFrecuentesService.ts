import apiAuth from "../../api/apiAuth";
import type { FAQ } from "../../models/FAQ";

export const GetAllPreguntasFrecuentes = async (): Promise<FAQ[]> => {
    const response = await apiAuth.get<FAQ[]>('/faq/');
    return response.data;
};