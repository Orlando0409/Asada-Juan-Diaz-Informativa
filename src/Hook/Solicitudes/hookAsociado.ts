import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Asociado } from "../../Schemas/Solicitudes/Asociado";
import { createAsociado } from "../../Services/Solicitudes/Asociado";

 export const useCambioMedidor=()=>{
    const queryClient=useQueryClient();

   const createMutation = useMutation({
  mutationFn: (data: Asociado) => createAsociado(data), 
  onSuccess: () =>{queryClient.invalidateQueries({ queryKey: ["asociado"] });
   console.log("Solicitud de asociado creada con éxito");
},
  onError: () => console.error("no se creo la solicitud de asociado"),
});

      return {

        createAsociado: createMutation.mutateAsync,

    }
}
