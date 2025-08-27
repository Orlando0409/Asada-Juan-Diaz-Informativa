import apiAuth from "../../api/apiAuth";
import type { Afiliacion } from "../../Schemas/Solicitudes/Afiliacion";

//traer las afiliaciones 
export async function getAllAfiliaciones(): Promise<Afiliacion[]> {
  const response = await apiAuth.get<Afiliacion[]>("/solicitud-afiliacion/all");
  return response.data; // ahora TypeScript sabe que es Afiliacion[]
}
//nueva afiliacion 
// 

export async function createAfiliacion(data: FormData) {
  const response = await apiAuth.post("/solicitud-afiliacion/create", data);
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