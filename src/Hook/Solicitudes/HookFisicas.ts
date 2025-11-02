import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAfiliacionFisica, createAsociadoFisica, createCambioMedidorFisica, createDesconexionFisica } from "../../Services/Solicitudes/SolicitudesFisicas";
import type { CambioMedidorFisico } from "../../models/Forms/Solicitudes/Fisico/CambioMedidor";
import type { AsociadoFisico } from "../../Schemas/Solicitudes/Fisica/Asociado";

export const useAfiliacionFisica = () => {
    const queryClient = useQueryClient();

    const createAfiliacionFisicaMutation = useMutation({
        mutationFn: (data: FormData) => createAfiliacionFisica(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["afiliaciones"] });
        },
        onError: (error: any) => {
            console.error("Error al crear la solicitud:", error?.response?.data || error);
        }
    });

    return {
        createAfiliacion: createAfiliacionFisicaMutation.mutateAsync,
    }
}

export const useDesconexionFisica = () => {
    const queryClient = useQueryClient();

    const createDesconexionFisicaMutation = useMutation({
        mutationFn: (data: FormData) => createDesconexionFisica(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["desconexion"] });
        },
        onError: (error: any) => {
            console.error("Error al crear la solicitud:", error?.response?.data || error);
        }
    });

    return {
        createDesconexion: createDesconexionFisicaMutation.mutateAsync,
    }
}

export const useCambioMedidorFisica = () => {
    const queryClient = useQueryClient();

    const createCambioMedidorFisicoMutation = useMutation({
        mutationFn: (data: CambioMedidorFisico) => createCambioMedidorFisica(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cambio-medidor"] });
        },
        onError: (error: any) => {
            console.error("Error al crear la solicitud:", error?.response?.data || error);
        }
    });

    return {
        createCambioMedidor: createCambioMedidorFisicoMutation.mutateAsync,
    }
}

export const useAsociadoFisica = () => {
    const queryClient = useQueryClient();

    const createAsociadoFisicoMutation = useMutation({
        mutationFn: (data: AsociadoFisico) => createAsociadoFisica(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["asociado"] });
        },
        onError: (error: any) =>
            console.error("Error al crear la solicitud:", error?.response?.data || error),
    });

    return {
        createAsociado: createAsociadoFisicoMutation.mutateAsync,
    }
}