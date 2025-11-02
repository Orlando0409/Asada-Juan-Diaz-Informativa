import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAfiliacionJuridica, createAsociadoJuridica, createCambioMedidorJuridica, createDesconexionJuridica } from "../../Services/Solicitudes/SolicitudesJuridicas";
import type { CambioMedidorJuridica } from "../../Schemas/Solicitudes/Juridica/CambioMedidorJuridico";
import type { AsociadoJuridico } from "../../models/Forms/Solicitudes/Juridica/AsociadoJuridica";

export const useAfiliacionJuridica = () => {
    const queryClient = useQueryClient();

    const createAfiliacionJuridicaMutation = useMutation({
        mutationFn: (data: FormData) => createAfiliacionJuridica(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["afiliaciones"] });
        },
        onError: (error: any) => {
            console.error("Error al crear la solicitud:", error?.response?.data || error);
        }
    });

    return {
        createAfiliacion: createAfiliacionJuridicaMutation.mutateAsync,
    }
}

export const useDesconexionJuridica = () => {
    const queryClient = useQueryClient();

    const createDesconexionJuridicaMutation = useMutation({
        mutationFn: (data: FormData) => createDesconexionJuridica(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["desconexion"] });
        },
        onError: (error: any) => {
            console.error("Error al crear la solicitud:", error?.response?.data || error);
        }
    });

    return {
        createDesconexion: createDesconexionJuridicaMutation.mutateAsync,
    }
}

export const useCambioMedidorJuridica = () => {
    const queryClient = useQueryClient();

    const createCambioMedidorJuridicaMutation = useMutation({
        mutationFn: (data: CambioMedidorJuridica) => createCambioMedidorJuridica(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cambio-medidor"] });
        },
        onError: (error: any) => {
            console.error("Error al crear la solicitud:", error?.response?.data || error);
        }
    });

    return {
        createCambioMedidor: createCambioMedidorJuridicaMutation.mutateAsync,
    }
}

export const useAsociadoJuridica = () => {
    const queryClient = useQueryClient();

    const createAsociadoJuridicoMutation = useMutation({
        mutationFn: (data: AsociadoJuridico) => createAsociadoJuridica(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["asociado"] });
        },
        onError: (error: any) => {
            console.error("Error al crear la solicitud:", error?.response?.data || error);
        }
    });

    return {
        createAsociado: createAsociadoJuridicoMutation.mutateAsync,
    }
}