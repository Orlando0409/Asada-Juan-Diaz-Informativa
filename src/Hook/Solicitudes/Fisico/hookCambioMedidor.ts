import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCambioMedidor } from "../../../Services/Solicitudes/Fisico/CambioMedidorService";
import type { CambioMedidor } from "../../../models/Forms/Solicitudes/Fisico/CambioMedidor";


 export const useCambioMedidor=()=>{
    const queryClient=useQueryClient();

   const createMutation = useMutation({
  mutationFn: (data: CambioMedidor) => createCambioMedidor(data), 
  onSuccess: () =>{queryClient.invalidateQueries({ queryKey: ["CambioMedidor"] });
   console.log("Solicitud de cambio de medidor creada con éxito");
},


onError: (error: any) => console.error("Error al crear la solicitud:", error.response?.data || error)

});

      return {
       
        createCambioMedidor: createMutation.mutateAsync,
  
    }
}