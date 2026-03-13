import apiAuth from "../../api/apiAuth";
import type { AsociadoJuridico } from "../../models/Forms/Solicitudes/Juridica/AsociadoJuridica";
import type { CambioMedidorJuridica } from "../../Schemas/Solicitudes/Juridica/CambioMedidorJuridico";

export async function createAfiliacionJuridica(data: FormData) {
    const response = await apiAuth.post("/solicitudes-juridicas/create/afiliacion", data);
    return response.data;
}

export async function createDesconexionJuridica(data: FormData) {
    const response = await apiAuth.post("/solicitudes-juridicas/create/desconexion", data);
    return response.data;
}

export async function createCambioMedidorJuridica(data: CambioMedidorJuridica) {
    const response = await apiAuth.post("/solicitudes-juridicas/create/cambio-medidor", data);
    return response.data;
}

export async function createAsociadoJuridica(data: AsociadoJuridico) {
    const response = await apiAuth.post("/solicitudes-juridicas/create/asociado", data);
    return response.data;
}


export async function createAgregarMedidorJuridica(data: FormData) {
    const response = await apiAuth.post("/solicitudes-juridicas/create/agregar-medidor", data);
    return response.data;
}
export async function getMedidoresByIdentificacionJuridica(cedulaJuridica: string) {
    const response = await apiAuth.get(`/afiliados/juridico/medidores/${cedulaJuridica}`);
    return response.data;
}

