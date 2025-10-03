import { useQuery } from "@tanstack/react-query";
import type { CalidadAguaArchivos } from "../../models/CalidadAgua/Archivos";
import { getCalidadAgua, getCalidadAguaVisibles } from "../../Services/CalidadDeAgua/CalidadAgua";

// Hook para obtener solo documentos visibles (para uso público)
export const useCalidadAguaVisiblesQuery = () => {
  return useQuery<CalidadAguaArchivos[]>({
    queryKey: ["CalidadAguaVisibles"],
    queryFn: getCalidadAguaVisibles,
  });
};

// Hook para obtener todos los documentos (para admin)
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