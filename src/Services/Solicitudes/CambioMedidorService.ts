import apiAuth from "../../api/apiAuth";
import type { CambioMedidor } from "../../Schemas/Solicitudes/CambioMedidor";

//traer las afiliaciones 

export async function getAllCambioMedidor(): Promise<CambioMedidor[]> {
  const response = await apiAuth.get("/solicitud-cambio-medidor/all");
  return response.data as CambioMedidor[];
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
// Crear nueva solicitud de cambio de medidor (solo para pruebas con Webhook.site)



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