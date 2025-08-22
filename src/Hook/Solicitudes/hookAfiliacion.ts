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
    
    const createMutation= useMutation({
        mutationFn: (data: AfiliacionFormData)=> createAfiliacion(data),
        onSuccess:()=>queryClient.invalidateQueries({queryKey:["afiliaciones"]}),
        onError: ()=>console.error("no se creo la afiliacion")
        
    })

    return {
        afiliaciones: afiliacionesQuery.data,
        isloading : afiliacionesQuery.isLoading,
        isError: afiliacionesQuery.isError,
        createAfiliacion: createMutation.mutateAsync,
    }



 }