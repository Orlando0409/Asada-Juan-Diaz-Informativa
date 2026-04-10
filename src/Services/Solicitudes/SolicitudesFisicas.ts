import apiAuth from "../../api/apiAuth";

export async function createAfiliacionFisica(data: FormData) {
  const response = await apiAuth.post("/solicitudes-fisicas/create/afiliacion", data);
  return response.data;
}

export async function createDesconexionFisica(data: FormData) {
  const response = await apiAuth.post("/solicitudes-fisicas/create/desconexion", data);
  return response.data;
}

export async function createCambioMedidorFisica(data: FormData) {
  const response = await apiAuth.post("/solicitudes-fisicas/create/cambio-medidor", data);
  return response.data;
}

export async function createAsociadoFisica(data: FormData) {
  const response = await apiAuth.post("/solicitudes-fisicas/create/asociado", data);
  return response.data;
}

export async function getMedidoresByIdentificacion(identificacion: string) {
  const response = await apiAuth.get(`/afiliados/fisico/medidores/${identificacion}`);
  return response.data;
}


export async function createAgregarMedidorFisica(data: FormData) {
  const response = await apiAuth.post("/solicitudes-fisicas/create/agregar-medidor", data);
  return response.data;
}




