import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { CambioMedidor } from "../../Schemas/Solicitudes/CambioMedidor";
import { createCambioMedidor } from "../../Services/Solicitudes/CambioMedidorService";


 export const useCambioMedidor=()=>{
    const queryClient=useQueryClient();

   const createMutation = useMutation({
  mutationFn: (data: CambioMedidor) => createCambioMedidor(data), // cambiar FormData por CambioMedidor
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["Desconexion"] }),
  onError: () => console.error("No se pudo crear la solicitud"),
});

      return {
       
        createCambioMedidor: createMutation.mutateAsync,
  
    }
}