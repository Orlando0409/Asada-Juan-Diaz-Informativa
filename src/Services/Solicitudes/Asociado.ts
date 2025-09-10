import apiAuth from "../../api/apiAuth";
import type { Asociado } from "../../Schemas/Solicitudes/Asociado";

export async function createAsociado(data: Asociado){
    const response = await apiAuth.post("/solicitud-asociado-fisica/create",data);
    return response.data; 
}

