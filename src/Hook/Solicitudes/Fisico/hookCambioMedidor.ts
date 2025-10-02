import { useMutation } from '@tanstack/react-query';
import { createCambioMedidor } from '../../../Services/Solicitudes/Fisico/CambioMedidorService';
import type { CambioMedidorFormData } from '../../../models/Forms/Solicitudes/Fisico/CambioMedidor';

export const useCambioMedidor = () => {
  const createCambioMedidorMutation = useMutation({
    mutationFn: (data: CambioMedidorFormData) => createCambioMedidor(data),
    onSuccess: (data) => {
      console.log('Solicitud creada exitosamente:', data);
    },
    onError: (error) => {
      console.error('Error al crear solicitud:', error);
    },
  });

  return {
    createCambioMedidor: createCambioMedidorMutation.mutateAsync,
    isLoading: createCambioMedidorMutation.isPending,
    error: createCambioMedidorMutation.error,
  };
};