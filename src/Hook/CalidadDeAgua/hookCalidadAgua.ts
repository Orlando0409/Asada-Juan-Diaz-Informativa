import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CalidadAguaArchivos } from "../../models/CalidadAgua/Archivos";
import { getCalidadAgua } from "../../Services/CalidadDeAgua/CalidadAgua";

 export const useCalidadAguaQuery = () => {
  return useQuery<CalidadAguaArchivos[]>({
    queryKey: ["CalidadAgua"],
    queryFn: getCalidadAgua,
  });
};



/*
export const useCalidadAguaMutation= ()=>{
    const QueryClient= useQueryClient();

     /*
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
}*/