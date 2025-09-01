import apiAuth from "../../api/apiAuth";

import type { CambioMedidor } from "../../Schemas/Solicitudes/CambioMedidor";


//nueva afiliacion 

export async function createCambioMedidor(data: FormData){
    const response = await apiAuth.post("/solicitud-cambio-mediador/create",data);
    return response.data; 
}

