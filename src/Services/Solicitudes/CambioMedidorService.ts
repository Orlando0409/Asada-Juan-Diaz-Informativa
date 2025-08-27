import apiAuth from "../../api/apiAuth";
import type { CambioMedidor } from "../../models/Solicitudes/CambioMedidor";
import type { Desconexion } from "../../models/Solicitudes/Desconexio";

//traer las afiliaciones 
/*
export async function getAllCambioMedidor(): Promise<CambioMedidor[]> {
  const response = await apiAuth.get("/solicitud-cambio-medidor/all");
  return response.data as CambioMedidor[];
}
*/
let mockDB: CambioMedidor[] = [];

export async function createCambioMedidor(data: CambioMedidor) {
  return new Promise<CambioMedidor>((resolve) => {
    setTimeout(() => {
      mockDB.push({ ...data, Id_Estado_Solicitud: 1 });
      console.log("Solicitud creada (mock):", data);
      resolve(data);
    }, 500); // simula retardo de red
  });
}

export async function getAllCambioMedidor(): Promise<CambioMedidor[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDB);
    }, 300);
  });
}



export async function getAllCambioMedidorById(id:number){
      const response = await apiAuth.get(`/solicitud-cambio-medidor/${id}`);
  return response.data;
}

//nueva afiliacion 
/*
export async function createCambioMedidor(data: CambioMedidor){
    const response = await apiAuth.post("/solicitud-cambio-medidor/create",data);
    return response.data; 
}*/
// Crear nueva solicitud de cambio de medidor (solo para pruebas con Webhook.site)

/*
export async function createCambioMedidor(data: CambioMedidor) {
  const response = await apiAuth.post(
    "https://webhook.site/3dafeb3d-90ed-48be-86b2-8d2667ea75dc",
    data
    // No es necesario poner headers manuales
  );
  return response.data;
}*/



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