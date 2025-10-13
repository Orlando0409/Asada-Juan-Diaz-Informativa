import apiAuth from "../../api/apiAuth";
import type { Proyecto } from "../../types/Proyecto/Proyecto";

export const getAllProyectos = async (): Promise<Proyecto[]> => {
  const response = await apiAuth.get<Proyecto[]>("/proyectos/all");
  return response.data;
};