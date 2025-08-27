import apiAuth from "../../api/apiAuth";
import type { Desconexion } from "../../models/Solicitudes/Desconexio";

//traer las afiliaciones 
export async function getAllDesconexion(): Promise<Desconexion[]> {
  const response = await apiAuth.get<Desconexion[]>("/solicitud-desconexion/all");
  return response.data;
}
export async function getAllDesconexionById(id:number){
      const response = await apiAuth.get(`/solicitud-desconexion/${id}`);
  return response.data;
}

//nueva afiliacion 
// Cambio en DesconexionService.ts
export async function createDesconexion(data: FormData) {
  const response = await apiAuth.post("/solicitud-desconexion/create", data); // FormData
  return response.data;
}


//actualizar 
export async function updateDesconexion(id:number,data:Desconexion) {
    const response =await apiAuth.put(`/solicitud-desconexion/${id}`, data);
    return response.data; 
    
}

// eliminar 
export async function deleteDesconexion (id:number ){
    const response = await apiAuth.delete(`/solicitud-desconexion/${id}`)
    return response.data;
}