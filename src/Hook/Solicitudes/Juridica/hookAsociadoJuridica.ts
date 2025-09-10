import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAsociadoJuridica } from "../../../Services/Solicitudes/Juridica/AsociadoJuricaService";
import type { AsociadoJuridico } from "../../../models/Forms/Solicitudes/Juridica/AsociadoJuridica";

export const useAsociadoJuridica = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: AsociadoJuridico) => createAsociadoJuridica(data), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["asociadoJuridica"] });
      console.log("Solicitud de asociado jurídica creada con éxito");
    },
    onError: () => console.error("No se creó la solicitud de asociado jurídica"),
  });

  return {
    createAsociadoJuridica: createMutation.mutateAsync,
  };
};