import apiAuth from "../../../api/apiAuth";
import type { CambioMedidorJuridica } from "../../../Schemas/Solicitudes/Juridica/CambioMedidorJuridico";

export async function createCambioMedidorJuridica(data: CambioMedidorJuridica){
    const response = await apiAuth.post("/solicitud-cambio-medidor-juridica/create", data);
    return response.data; 
}
