import apiAuth from "../../../api/apiAuth";

export async function createDesconexionJuridica(data: FormData) {
   const response = await apiAuth.post("/solicitud-desconexion-juridica/create", data);
   return response.data;
}
