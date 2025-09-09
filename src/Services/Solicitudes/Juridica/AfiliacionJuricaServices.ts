import apiAuth from "../../../api/apiAuth";

export async function createAfiliacionJuridica(data: FormData) {
  const response = await apiAuth.post("/solicitud-afiliacion-juridica/create", data);
  return response.data;
}
