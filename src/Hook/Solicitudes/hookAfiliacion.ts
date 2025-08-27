import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createAfiliacion, getAllAfiliaciones } from "../../Services/Solicitudes/AfiliacionService";
import type { Afiliacion, AfiliacionFormData } from "../../models/Solicitudes/Afiliacion";

 
 export const useAfiliaciones=()=>{
    const queryClient=useQueryClient();
    
    //trae afiliaciones 
    const afiliacionesQuery = useQuery<Afiliacion[]>({
        queryKey:["afiliaciones"],
        queryFn:getAllAfiliaciones,
        staleTime:5*60*1000,
        refetchOnWindowFocus: false 

    })
    
        const createMutation = useMutation({
        mutationFn: (data: FormData) => createAfiliacion(data), // espera FormData
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["afiliaciones"] });
        console.log("Afiliación creada con éxito");
       },
        //onError: ()=>console.error("no se creo la afiliacion")


        onError: (error) => {
      console.error(" No se creó la afiliación");
      if (error instanceof Error) console.error("Mensaje de error:", error.message);
      if ((error as any)?.response) {
        console.error("Status:", (error as any).response.status);
        console.error("Data:", (error as any).response.data);
      }
    },


    })

    return {
        afiliaciones: afiliacionesQuery.data,
        isloading : afiliacionesQuery.isLoading,
        isError: afiliacionesQuery.isError,
        createAfiliacion: createMutation.mutateAsync,
    }



 }