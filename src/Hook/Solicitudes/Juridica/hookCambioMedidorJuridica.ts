import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCambioMedidorJuridica } from "../../../Services/Solicitudes/Juridica/CambioMedidorJurica";
import type { CambioMedidor } from "../../../Schemas/Solicitudes/CambioMedidor";

export const useCambioMedidorJuridica = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CambioMedidor) => createCambioMedidorJuridica(data), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["CambioMedidorJuridica"] });
      console.log("Solicitud de cambio de medidor jurídica creada con éxito");
    },
    onError: () => console.error("No se creó la solicitud de cambio de medidor jurídica"),
  });

  return {
    createCambioMedidorJuridica: createMutation.mutateAsync,
  };
};