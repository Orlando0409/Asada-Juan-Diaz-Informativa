import apiAuth from "../../../api/apiAuth";

 
// Cambio en DesconexionService.ts
export async function createDesconexion(data: FormData) {
  const response = await apiAuth.post("/solicitud-desconexion-fisica/create", data); 
  return response.data;
}

