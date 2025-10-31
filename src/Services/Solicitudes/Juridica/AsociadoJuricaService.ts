import apiAuth from "../../../api/apiAuth";
import type { AsociadoJuridico } from "../../../models/Forms/Solicitudes/Juridica/AsociadoJuridica";

export async function createAsociadoJuridica(data: AsociadoJuridico){
    const response = await apiAuth.post("/solicitud-asociado-juridica/create", data);
    return response.data; 
}
