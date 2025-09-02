import apiAuth from "../../api/apiAuth";
import type { CalidadAguaArchivos } from "../../models/CalidadAgua/Archivos";

export async function getCalidadAgua() {
  const res = await apiAuth.get("calidad-agua/all");
  return res.data as CalidadAguaArchivos[];
}


/*
 export async function createCalidadAgua(data:Omit<CalidadAguaArchivos, "id">){
    const response = await apiAuth.post("/calidad-agua/create",data);
      return response.data;
 }*/