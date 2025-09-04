import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Asociado } from "../../Schemas/Solicitudes/Asociado";
import { createAsociado } from "../../Services/Solicitudes/Asociado";

 export const useCambioMedidor=()=>{
    const queryClient=useQueryClient();

   const createMutation = useMutation({
  mutationFn: (data: Asociado) => createAsociado(data), 
  onSuccess: () =>{queryClient.invalidateQueries({ queryKey: ["Asociado"] });
   console.log("Solicitud de asociado creada con éxito");
},


onError: (error: any) => console.error("Error al crear la solicitud:", error.response?.data || error)

});

      return {

        createAsociado: createMutation.mutateAsync,

    }
}