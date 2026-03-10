import apiAuth from "../../api/apiAuth";
import type { AsociadoFisico } from "../../Schemas/Solicitudes/Fisica/Asociado";
import type { CambioMedidorFisico } from "../../models/Forms/Solicitudes/Fisico/CambioMedidor";

export async function createAfiliacionFisica(data: FormData) {
  const response = await apiAuth.post("/solicitudes-fisicas/create/afiliacion", data);
  return response.data;
}

export async function createDesconexionFisica(data: FormData) {
  const response = await apiAuth.post("/solicitudes-fisicas/create/desconexion", data);
  return response.data;
}

export async function createCambioMedidorFisica(data: CambioMedidorFisico) {
  const response = await apiAuth.post("/solicitudes-fisicas/create/cambio-medidor", data);
  return response.data;
}

export async function createAsociadoFisica(data: AsociadoFisico) {
  const response = await apiAuth.post("/solicitudes-fisicas/create/asociado", data);
  return response.data;
}

export async function getMedidoresByIdentificacion(identificacion: string) {
  const response = await apiAuth.get(`/afiliados/fisico/medidores/${identificacion}`);
  return response.data;
}