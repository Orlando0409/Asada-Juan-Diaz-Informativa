import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Asociado } from "../../../Schemas/Solicitudes/Fisica/Asociado";
import { createAsociado } from "../../../Services/Solicitudes/Fisico/Asociado";

export const useAsociadoMedidor = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: Asociado) => {
      if (!data) throw new Error("No se recibió información para crear el asociado.");
      return createAsociado(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["asociado"] });
      console.log("Solicitud de asociado creada con éxito");
    },
    onError: (error: any) =>
      console.error("Error al crear la solicitud:", error?.response?.data || error),
  });

  return {
    createAsociado: createMutation.mutateAsync,
  };
};