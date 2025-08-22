import apiAuth from "../../api/apiAuth";
import type { Desconexion } from "../../models/Solicitudes/Desconexio";

//traer las afiliaciones 
export async function getAllDesconexion(){
      const response = await apiAuth.get("/solicitud-afiliacion/all");
  return response.data;
}
export async function getAllDesconexionById(id:number){
      const response = await apiAuth.get(`/solicitud-desconexion/${id}`);
  return response.data;
}

//nueva afiliacion 
export async function createDesconexion(data: Desconexion){
    const response = await apiAuth.post("/solicitud-desconexion/create",data);
    return response.data; 
}

//actualizar 
export async function updateDesconexion(id:number,data:Desconexion) {
    const response =await apiAuth.put(`/solicitud-desconexion/${id}`, data);
    return response.data; 
    
}

// eliminar 
export async function deleteDesconexion (id:number ){
    const response = await apiAuth.delete(`/solicitud-afiliacion/${id}`)
    return response.data;
}