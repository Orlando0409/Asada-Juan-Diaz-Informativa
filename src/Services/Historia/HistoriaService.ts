import apiAuth from "../../api/apiAuth";
import type { Historia } from "../../models/Historia/Historia";

export const getAllHistoria = async (): Promise<Historia[]> => {
  const response = await apiAuth.get<Historia[]>("/historia/all");
  return response.data;
}; 
