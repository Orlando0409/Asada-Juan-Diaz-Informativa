import { useMutation } from "@tanstack/react-query";
import { sendQueja, sendReporte, sendSugerencia } from "../../Services/Forms/ContactoService";
import type { ContactoTipo } from "../../types/ContactoForms";
import { useAlerts } from "../../context/AlertContext";
import {useNavigate} from "@tanstack/react-router";
// Este tipo representa los datos dinámicos del formulario
type ContactoFormPayload = Record<string, number | string | File | undefined>;

export function useCreateContacto() {
  const { showSuccess, showError } = useAlerts();
  const navigate = useNavigate();
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
    // redireccionar al inicio y mostrar mensaje de éxito
    onSuccess: (_data, variables) => {
      showSuccess("¡Enviado con éxito!", "Tu " + variables.tipo + " ha sido enviado correctamente.");
      navigate({ to: "/" });
    },
    onError: (error : any) => {
      const errorMessage = error?.response?.data?.message || 'Error al enviar el formulario.';
      console.log("Error al enviar formulario:", errorMessage || error);
      showError("Error",errorMessage);
    },
  });
}