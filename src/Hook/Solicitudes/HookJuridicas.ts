
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAfiliacionJuridica, createAgregarMedidorJuridica, createAsociadoJuridica, createCambioMedidorJuridica, createDesconexionJuridica, getMedidoresByIdentificacionJuridica } from "../../Services/Solicitudes/SolicitudesJuridicas";
import type { AsociadoJuridico } from "../../models/Forms/Solicitudes/Juridica/AsociadoJuridica";
import type { Medidor } from "../../models/Medidor";
import type { MedidoresResponse } from "../../models/Forms/Solicitudes/Fisico/CambioMedidor";
import { useAlerts } from "../../context/AlertContext";

export const useAfiliacionJuridica = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useAlerts();

    const createAfiliacionJuridicaMutation = useMutation({
        mutationFn: (data: FormData) => createAfiliacionJuridica(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["afiliaciones"] });
            showSuccess("¡Solicitud creada!", "La solicitud de afiliación ha sido creada con éxito.");
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Error al enviar el formulario.';
            console.log("Error al crear la solicitud:", error?.response?.data || error);
            showError("Error", errorMessage);
        }
    });

    return {
        createAfiliacion: createAfiliacionJuridicaMutation.mutateAsync,
    }
}

export const useDesconexionJuridica = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useAlerts();

    const createDesconexionJuridicaMutation = useMutation({
        mutationFn: (data: FormData) => createDesconexionJuridica(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["desconexion"] });
            showSuccess("¡Solicitud creada!", "La solicitud de desconexión ha sido creada con éxito.");
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Error al enviar el formulario.';
            console.log("Error al crear la solicitud:", error?.response?.data || error);
            showError("Error", errorMessage);
        }
    });

    return {
        createDesconexion: createDesconexionJuridicaMutation.mutateAsync,
    }
}

export const useCambioMedidorJuridica = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useAlerts();

    const createCambioMedidorJuridicaMutation = useMutation({
        mutationFn: (data: FormData) => createCambioMedidorJuridica(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cambio-medidor"] });
            showSuccess("¡Solicitud creada!", "La solicitud de cambio de medidor ha sido creada con éxito.");
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Error al enviar el formulario.';
            console.log("Error al crear la solicitud:", error?.response?.data || error);
            showError("Error", errorMessage);
        }
    });

    return {
        createCambioMedidor: createCambioMedidorJuridicaMutation.mutateAsync,
    }
}

export const useAsociadoJuridica = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useAlerts();

    const createAsociadoJuridicoMutation = useMutation({
        mutationFn: (data: AsociadoJuridico) => createAsociadoJuridica(data),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["asociado"] });
            showSuccess("¡Solicitud creada!", "La solicitud de asociado ha sido creada con éxito.");
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Error al enviar el formulario.';
            console.log("Error al crear la solicitud:", error?.response?.data || error);
            showError("Error", errorMessage);
        }
    });

    return {
        createAsociado: createAsociadoJuridicoMutation.mutateAsync,
    }
}

export const useAgregarMedidorJuridica = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useAlerts();

    const mutation = useMutation({
        mutationFn: (data: FormData) => createAgregarMedidorJuridica(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["agregar-medidor"] });
            queryClient.invalidateQueries({ queryKey: ["medidores-juridica"] });
            showSuccess("¡Solicitud creada!", "La solicitud para agregar medidor extra ha sido creada con éxito.");
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error?.message || 'Error al enviar el formulario.';
            console.log("Error al crear la solicitud:", error?.response?.data || error);
            showError("Error", errorMessage);
        },
    });

    return mutation;
}

export const useMedidoresJuridica = (cedulaJuridica: string) => {
    const { data: responseData, isLoading, error } = useQuery<MedidoresResponse>({
        queryKey: ["medidores-juridica", cedulaJuridica],
        queryFn: (): Promise<MedidoresResponse> => getMedidoresByIdentificacionJuridica(cedulaJuridica) as Promise<MedidoresResponse>,
        enabled: !!cedulaJuridica && cedulaJuridica.length >= 9,
        staleTime: 5 * 60 * 1000,
    });

    // Asegurar que siempre retornemos un array
    const medidores = Array.isArray(responseData) ? responseData :
        responseData?.medidores ? (Array.isArray(responseData.medidores) ? responseData.medidores : [responseData.medidores]) :
            responseData?.Medidores ? (Array.isArray(responseData.Medidores) ? responseData.Medidores : [responseData.Medidores]) :
                responseData?.data ? (Array.isArray(responseData.data) ? responseData.data : [responseData.data]) :
                    [];

    return {
        medidores: medidores as Medidor[],
        isLoading,
        error,
    };
};