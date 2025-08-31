import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

//import type { CambioMedidor } from "../../Schemas/Solicitudes/CambioMedidor";
import { createCambioMedidor } from "../../Services/Solicitudes/CambioMedidorService";
import type { CambioMedidorBackend } from "../../models/Forms/Solicitudes/CambioMedidor";


 export const useCambioMedidor=()=>{
    const queryClient=useQueryClient();

   const createMutation = useMutation({
  mutationFn: (data: CambioMedidorBackend) => createCambioMedidor(data), // cambiar FormData por CambioMedidor
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["Desconexion"] }),
onError: (error: any) => console.error("Error al crear la solicitud:", error.response?.data || error)

});

      return {
       
        createCambioMedidor: createMutation.mutateAsync,
  
    }
}