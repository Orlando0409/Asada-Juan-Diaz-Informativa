import { useMutation } from "@tanstack/react-query";
import { sendQueja, sendReporte, sendSugerencia } from "../../Services/Forms/ContactoService";
import type { ContactoTipo } from "../../types/ContactoForms";

// Este tipo representa los datos dinámicos del formulario
type ContactoFormPayload = Record<string, number | string | File | undefined>;

export function useCreateContacto() {
  return useMutation({
    mutationFn: async (payload: { data: ContactoFormPayload; tipo: ContactoTipo }) => {
      const { data, tipo } = payload;
      switch (tipo) {
        case "Queja":
          return sendQueja(data);
        case "Sugerencia":
          return sendSugerencia(data);
        case "Reporte":
          return sendReporte(data);
        default:
          throw new Error("Tipo de contacto no válido");
      }
    },
    onSuccess: () => {
      // Puedes agregar lógica de éxito aquí
    },
    onError: (error) => {
      console.error("Hubo un error al enviar el contacto:", error);
    },
  });
}