import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAfiliacionFisica, createAgregarMedidorFisica, createAsociadoFisica, createCambioMedidorFisica, createDesconexionFisica, getMedidoresByIdentificacion } from "../../Services/Solicitudes/SolicitudesFisicas";
import type { CambioMedidorFisico, MedidoresResponse } from "../../models/Forms/Solicitudes/Fisico/CambioMedidor";
import type { AsociadoFisico } from "../../Schemas/Solicitudes/Fisica/Asociado";
import type { Medidor } from "../../models/Medidor";
import { useAlerts } from "../../context/AlertContext";

export const useAfiliacionFisica = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useAlerts();

    const createAfiliacionFisicaMutation = useMutation({
        mutationFn: (data: FormData) => createAfiliacionFisica(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["afiliaciones"] });
            showSuccess("¡Solicitud creada!", "La solicitud de afiliación ha sido creada con éxito.");
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message;
            console.log("Error al crear la solicitud:", error?.response?.data || error);
            showError("Error", errorMessage);
        }
    });

    return {
        createAfiliacion: createAfiliacionFisicaMutation.mutateAsync,
    }
}

export const useDesconexionFisica = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useAlerts();

    const createDesconexionFisicaMutation = useMutation({
        mutationFn: (data: FormData) => createDesconexionFisica(data),
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
        createDesconexion: createDesconexionFisicaMutation.mutateAsync,
    }
}

export const useCambioMedidorFisica = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useAlerts();

    const createCambioMedidorFisicoMutation = useMutation({
        mutationFn: (data: CambioMedidorFisico) => createCambioMedidorFisica(data),
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
        createCambioMedidor: createCambioMedidorFisicoMutation.mutateAsync,
    }
}

export const useAsociadoFisica = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useAlerts();

    const createAsociadoFisicoMutation = useMutation({
        mutationFn: (data: AsociadoFisico) => createAsociadoFisica(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["asociado"] });
            showSuccess("¡Solicitud creada!", "La solicitud de asociado ha sido creada con éxito.");
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Error al enviar el formulario.';
            console.log("Error al crear la solicitud:", error?.response?.data || error);
            showError("Error", errorMessage);
        },
    });

    return {
        createAsociado: createAsociadoFisicoMutation.mutateAsync,
    }
}

export const useAgregarMedidorFisica = () => {
    const queryClient = useQueryClient();
    const { showSuccess, showError } = useAlerts();

    const mutation = useMutation({
        mutationFn: (data: FormData) => createAgregarMedidorFisica(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["agregar-medidor"] });
            showSuccess("¡Solicitud creada!", "La solicitud de agregar medidor ha sido creada con éxito.");
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || error?.message || 'Error al enviar el formulario.';
            console.log("Error al crear la solicitud:", error?.response?.data || error);
            showError("Error", errorMessage);
        }
    });

    return mutation;
}

export const useMedidores = (identificacion: string) => {
    const { data: responseData, isLoading, error } = useQuery<MedidoresResponse>({
        queryKey: ["medidores", identificacion],
        queryFn: (): Promise<MedidoresResponse> => getMedidoresByIdentificacion(identificacion) as Promise<MedidoresResponse>,
        enabled: !!identificacion && identificacion.length >= 9,
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