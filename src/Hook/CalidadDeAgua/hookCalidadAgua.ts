import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CalidadAguaArchivos } from "../../models/CalidadAgua/Archivos";
import { createCalidadAgua } from "../../Services/CalidadDeAgua/CalidadAgua";

export const useCalidadAguaMutation= ()=>{
    const QueryClient= useQueryClient();

    const createMutation=useMutation({
        mutationFn:(data: Omit<CalidadAguaArchivos,"id">)=>createCalidadAgua(data),
        onSuccess:()=>{
            QueryClient.invalidateQueries({queryKey:["CalidadAgua"]})
        },
        onError:()=> console.error ("error no se creo el archivo  ")
    })
    return {
       createCalidadAgua: createMutation.mutateAsync,
    }
}