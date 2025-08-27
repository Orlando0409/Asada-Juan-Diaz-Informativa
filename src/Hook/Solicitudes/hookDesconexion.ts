import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Desconexion } from "../../models/Solicitudes/Desconexio";
import { createDesconexion, deleteDesconexion, getAllDesconexion, updateDesconexion } from "../../Services/Solicitudes/DesconexionService";

 export const useDesconexion=()=>{
   const queryClient = useQueryClient();

  // Función para parsear errores
  const parseError = (error: any): string => {
    if (error instanceof Error) return error.message;
    if (error?.response?.data) return JSON.stringify(error.response.data);
    return "Error desconocido";
  };

  // Traer todas las solicitudes
  const desconexionQuery = useQuery<Desconexion[]>({
    queryKey: ["Desconexion"],
    queryFn: getAllDesconexion,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Crear solicitud con FormData
  const createMutation = useMutation({
    mutationFn: (data: FormData) => createDesconexion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Desconexion"] });
      console.log(" Desconexión creada con éxito");
    },
    onError: (error) => {
      const mensaje = parseError(error);
      console.error(`No se pudo crear la desconexión: ${mensaje}`);
      //alert(`No se pudo crear la desconexión: ${mensaje}`);
    },
  });


    //actualizar solicsitud 
    const upadateMutation = useMutation({
    mutationFn: ({id,data}: {id:number; data:Desconexion})=>updateDesconexion(id,data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["desconexion"] }),
    onError: () => console.error("No se actualizó la solicitud de desconexión"),
   
})

 // eliminar solicitud 
 const deleteMutation=useMutation({
    mutationFn:(id:number)=>deleteDesconexion(id),
    onSuccess:()=>queryClient.invalidateQueries({queryKey:["desconexion"]}),
    onError: () => console.error("No se eliminó la solicitud de desconexión"),
 })


      return {
        desconexiones: desconexionQuery.data, //  usamos la variable declarada arriba
        isLoading: desconexionQuery.isLoading,
        isError: desconexionQuery.isError,
        createDesconexion: createMutation.mutateAsync,
        updateDesconexion: upadateMutation.mutateAsync,
        deleteDesconexion: deleteMutation.mutateAsync,
    }
}