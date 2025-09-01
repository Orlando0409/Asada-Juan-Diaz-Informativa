import apiAuth from "../../api/apiAuth";
import type { CalidadAguaArchivos } from "../../models/CalidadAgua/Archivos";

 export async function createCalidadAgua(data:Omit<CalidadAguaArchivos, "id">){
    const response = await apiAuth.post("/CalidadAgua",data);
      return response.data;
 }