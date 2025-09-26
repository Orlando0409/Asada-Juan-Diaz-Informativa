import apiAuth from "../../../api/apiAuth";
import type { CambioMedidorFormData } from "../../../models/Forms/Solicitudes/Fisico/CambioMedidor";

//nueva afiliacion
export async function createCambioMedidor(data: CambioMedidorFormData) {
  const response = await apiAuth.post("/solicitud-cambio-medidor-fisica/create", data);
  return response.data;
}
/*
export async function createCambioMedidor(data: FormData){
    const response = await apiAuth.post("/solicitud-cambio-medidor-fisica/create",data);
    return response.data; 
}*/
