import apiAuth from "../../../api/apiAuth";
import type { CambioMedidor } from "../../../Schemas/Solicitudes/Fisica/CambioMedidor";

//nueva afiliacion
export async function createCambioMedidor(data: FormData){
    const response = await apiAuth.post("/solicitud-cambio-medidor-fisica/create",data);
    return response.data; 
}