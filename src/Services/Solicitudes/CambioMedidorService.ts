import apiAuth from "../../api/apiAuth";
import type { CambioMedidor } from "../../Schemas/Solicitudes/CambioMedidor";


//nueva afiliacion 

export async function createCambioMedidor(data: CambioMedidor){
    const response = await apiAuth.post("/solicitud-cambio-medidor/create",data);
    return response.data; 
}

