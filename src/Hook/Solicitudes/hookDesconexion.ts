import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createDesconexion } from "../../Services/Solicitudes/DesconexionService";

 export const useDesconexion=()=>{
   const queryClient = useQueryClient();

  // Crear solicitud con FormData
  const createMutation = useMutation({
    mutationFn: (data: FormData) => createDesconexion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Desconexion"] });
    },
    onError:()=>console.error("no se creo la solicitud de desconexion"),
   
  });

      return {
       
        createDesconexion: createMutation.mutateAsync,
       
    }
}