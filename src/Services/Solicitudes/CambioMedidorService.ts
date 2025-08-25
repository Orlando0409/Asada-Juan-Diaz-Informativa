import apiAuth from "../../api/apiAuth";
import type { CambioMedidor } from "../../models/Solicitudes/CambioMedidor";
import type { Desconexion } from "../../models/Solicitudes/Desconexio";

//traer las afiliaciones 
export async function getAllCambioMedidor(){
      const response = await apiAuth.get("/solicitud-cambio-medidor/all");
  return response.data;
}
export async function getAllCambioMedidorById(id:number){
      const response = await apiAuth.get(`/solicitud-cambio-medidor/${id}`);
  return response.data;
}

//nueva afiliacion 
export async function createCambioMedidor(data: CambioMedidor){
    const response = await apiAuth.post("/solicitud-cambio-medidor/create",data);
    return response.data; 
}

//actualizar 
export async function updateCambioMedidor(id:number,data:CambioMedidor) {
    const response =await apiAuth.put(`/solicitud-cambio-medidor/${id}`, data);
    return response.data; 
    
}

// eliminar 
export async function deleteCambioMedidor (id:number ){
    const response = await apiAuth.delete(`/solicitud-cambioMedidor/${id}`)
    return response.data;
}