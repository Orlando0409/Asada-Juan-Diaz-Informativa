import apiAuth from "../../api/apiAuth";


export async function createAfiliacion(data: FormData) {
  const response = await apiAuth.post("/solicitud-afiliacion-fisica/create", data);
  return response.data;
}

