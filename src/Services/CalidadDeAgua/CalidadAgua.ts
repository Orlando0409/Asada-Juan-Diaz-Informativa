import apiAuth from "../../api/apiAuth";
import type { CalidadAguaArchivos } from "../../models/CalidadAgua/Archivos";

// Función para obtener solo los documentos visibles (público)
export async function getCalidadAguaVisibles() {
  const res = await apiAuth.get("calidad-agua/visibles");
  return res.data as CalidadAguaArchivos[];
}

// Función para obtener todos los documentos (admin)
export async function getCalidadAgua() {
  const res = await apiAuth.get("calidad-agua/all");
  return res.data as CalidadAguaArchivos[];
}


/*
 export async function createCalidadAgua(data:Omit<CalidadAguaArchivos, "id">){
    const response = await apiAuth.post("/calidad-agua/create",data);
      return response.data;
 }*/