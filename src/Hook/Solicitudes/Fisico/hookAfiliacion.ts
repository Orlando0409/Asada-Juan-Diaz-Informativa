import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createAfiliacion } from "../../../Services/Solicitudes/Fisico/AfiliacionService";

 export const useAfiliaciones=()=>{
    const queryClient=useQueryClient();
    
        const createMutation = useMutation({
        mutationFn: (data: FormData) => createAfiliacion(data), // espera un FormData
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["afiliaciones"] });
        console.log("Solicitud de afiliación creada con éxito");
       },
        onError: ()=>console.error("no se creo la solicitud de afiliacion"),
      });
     
    return {
        createAfiliacion: createMutation.mutateAsync,
    }

    


 }