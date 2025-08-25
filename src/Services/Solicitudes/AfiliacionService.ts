import apiAuth from "../../api/apiAuth";
import type { Afiliacion, AfiliacionFormData } from "../../models/Solicitudes/Afiliacion";

//traer las afiliaciones 
export async function getAllAfiliaciones(){
      const response = await apiAuth.get("/solicitud-afiliacion/all");
  return response.data;
}
//nueva afiliacion 
export async function createAfiliacion(data:AfiliacionFormData){
    const response = await apiAuth.post("/solicitud-afiliacion/create",data);
    return response.data; 
}

//actualizar 
export async function updateAfiliacion(id:number,data:Afiliacion) {
    const response =await apiAuth.put(`/solicitud-afiliacion/${id}`, data);
    return response.data; 
    
}

// eliminar 
export async function deleteAfiliacion (id:number ){
    const response = await apiAuth.delete(`/solicitud-afiliacion/${id}`)
    return response.data;
}