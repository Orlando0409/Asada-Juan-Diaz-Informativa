import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDesconexionJuridica } from "../../../Services/Solicitudes/Juridica/DesconexionJuridicaService";

export const useDesconexionJuridica = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: FormData) => createDesconexionJuridica(data), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["desconexionJuridica"] });
      console.log("Solicitud de desconexión jurídica creada con éxito");
    },
    onError: () => console.error("No se creó la solicitud de desconexión jurídica"),
  });

  return {
    createDesconexionJuridica: createMutation.mutateAsync,
  };
};