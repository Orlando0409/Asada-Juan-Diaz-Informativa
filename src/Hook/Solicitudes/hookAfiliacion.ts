import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createAfiliacion } from "../../Services/Solicitudes/AfiliacionService";

 export const useAfiliaciones=()=>{
    const queryClient=useQueryClient();
    
        const createMutation = useMutation({
        mutationFn: (data: FormData) => createAfiliacion(data), // espera un FormData
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["afiliaciones"] });
        
       },
        onError: ()=>console.error("no se creo la solicitud de afiliacion"),
      });
     
    return {
        createAfiliacion: createMutation.mutateAsync,
    }


 }