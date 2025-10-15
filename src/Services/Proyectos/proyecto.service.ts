import apiAuth from "../../api/apiAuth";
import type { Proyecto } from "../../types/Proyecto/Proyecto";

// Obtener todos los proyectos (para admins)
export const getAllProyectos = async (): Promise<Proyecto[]> => {
  const response = await apiAuth.get("/proyectos/all");
  return response.data as Proyecto[];
};

// Obtener solo proyectos visibles (para usuarios públicos)
export const getProyectosVisibles = async (): Promise<Proyecto[]> => {
  const response = await apiAuth.get("/proyectos/visibles");
  return response.data as Proyecto[];
};