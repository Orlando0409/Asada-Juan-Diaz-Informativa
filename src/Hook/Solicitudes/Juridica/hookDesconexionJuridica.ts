import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDesconexionJuridica } from "../../../Services/Solicitudes/Juridica/DesconexionMedidorJuridica";

export const useDesconexionJuridica = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: FormData) => {
      return createDesconexionJuridica(data);
    },onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["desconexionJuridica"] });
    },
    onError: (error: any) => {
      console.error("Error al crear solicitud de desconexión jurídica:", error);
    },
  });

  return {
    createDesconexionJuridica: createMutation.mutateAsync,
  };
};