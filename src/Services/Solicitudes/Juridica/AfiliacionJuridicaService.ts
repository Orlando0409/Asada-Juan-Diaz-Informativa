import apiAuth from "../../../api/apiAuth";
import type { AfiliacionJuridica } from "../../../models/Forms/Solicitudes/Juridica/AfiliacionJurica";

export async function createAfiliacionJuridica(data: FormData) {
    const response = await apiAuth.post("/solicitud-afiliacion-juridica/create", data);
    return response.data; 
}
