//import { CambioMedidor } from './../../Schemas/Solicitudes/CambioMedidor';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
//import type { CambioMedidor } from "../../Schemas/Solicitudes/CambioMedidor";
import { createCambioMedidor, deleteCambioMedidor, getAllCambioMedidor, updateCambioMedidor } from "../../Services/Solicitudes/CambioMedidorService";
import type { CambioMedidor } from "../../models/Solicitudes/CambioMedidor";

 export const useCambioMedidor=()=>{
    const queryClient=useQueryClient();
    
    //trae afiliaciones 
    const CambioMedidorQuery = useQuery<CambioMedidor[]>({
        queryKey:["Desconexion"],
        queryFn:getAllCambioMedidor,
        staleTime:5*60*1000,
        refetchOnWindowFocus: false 

    })
    
    const createMutation= useMutation({
        mutationFn: (data: CambioMedidor)=> createCambioMedidor(data),
        onSuccess:()=>queryClient.invalidateQueries({queryKey:["cambioMedidor"]}),
        onError: ()=>console.error("no se creo la solicitud ")
        
    })


    //actualizar solicsitud 
    const upadateMutation = useMutation({
    mutationFn: ({id,data}: {id:number; data:CambioMedidor})=>updateCambioMedidor(id,data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["desconexion"] }),
     onError: () => console.error("No se actualizó la solicitud de cambioMedidor"),
   
})

 // eliminar solicitud 
 const deleteMutation=useMutation({
    mutationFn:(id:number)=>deleteCambioMedidor(id),
    onSuccess:()=>queryClient.invalidateQueries({queryKey:["desconexion"]}),
    onError: () => console.error("No se eliminó la solicitud de desconexión"),
 })


      return {
        desconexiones: CambioMedidorQuery.data, // ✅ usamos la variable declarada arriba
        isLoading: CambioMedidorQuery.isLoading,
        isError: CambioMedidorQuery.isError,
    }
}