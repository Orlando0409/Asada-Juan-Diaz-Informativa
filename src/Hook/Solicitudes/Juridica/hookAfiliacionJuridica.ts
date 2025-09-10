import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAfiliacionJuridica } from "../../../Services/Solicitudes/Juridica/AfiliacionJuridicaService";

export const useAfiliacionJuridica = () => {
  const queryClient = useQueryClient(); 
 const createMutation = useMutation({
    mutationFn: (data: FormData) => createAfiliacionJuridica(data), // espera un FormData
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["afiliacionesJuridicas"] });
      console.log("Solicitud de afiliación jurídica creada con éxito");
    },
    onError: () => console.error("No se creó la solicitud de afiliación jurídica"),
  });

  return {
    createAfiliacionJuridica: createMutation.mutateAsync,
  }
};
