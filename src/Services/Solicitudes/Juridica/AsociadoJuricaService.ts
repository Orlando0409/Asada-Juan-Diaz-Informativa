import apiAuth from "../../../api/apiAuth";
import type { AsociadoJuridica } from "../../../Schemas/Solicitudes/Juridica/AsociadoJuridica";
//import type { AsociadoJuridica } from "../../../Schemas/Solicitudes/Juridica/AsociadoJuridica";
export async function createAsociadoJuridica(data: AsociadoJuridica){
    const response = await apiAuth.post("/solicitud-asociado-juridica/create", data);
    return response.data; 
}
