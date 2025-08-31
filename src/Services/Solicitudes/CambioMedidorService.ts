import apiAuth from "../../api/apiAuth";
import type { CambioMedidorBackend } from "../../models/Forms/Solicitudes/CambioMedidor";
import type { CambioMedidor } from "../../Schemas/Solicitudes/CambioMedidor";


//nueva afiliacion 

export async function createCambioMedidor(data: CambioMedidorBackend){
    const response = await apiAuth.post("/solicitud-cambio-mediador/create",data);
    return response.data; 
}

