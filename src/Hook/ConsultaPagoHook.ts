import {
    GenerarPDFConsultaPago,
    getConsultaPagosAfiliadoFisico,
    getConsultaPagosAfiliadoJuridico,
    getConsultaPagosMedidor,
} from "../Services/Consulta/ConsultaService";
import type {
    ConsultaFisicaDTO,
    ConsultaFisicaResponse,
    GenerarFacturaConsultaDTO,
    ConsultaMedidorResponse,
    ConsultaJuridicaDTO,
    ConsultaJuridicaResponse,
} from "../types/Consulta/Pagos";

export const useConsultaPago = () => {
    const consultaPagosMedidor = async (numeroMedidor: number): Promise<ConsultaMedidorResponse> => {
        try {
            const response = await getConsultaPagosMedidor(numeroMedidor);
            return response;
        } catch (error) {
            console.error("Error al consultar pagos por medidor:", error);
            throw error;
        }
    };

    const consultaPagosAfiliadoFisico = async (consultaData: ConsultaFisicaDTO): Promise<ConsultaFisicaResponse> => {
        try {
            const response = await getConsultaPagosAfiliadoFisico(consultaData);
            return response;
        } catch (error) {
            console.error("Error al consultar pagos para afiliado físico:", error);
            throw error;
        }
    };

    const consultaPagosAfiliadoJuridico = async (consultaData: ConsultaJuridicaDTO): Promise<ConsultaJuridicaResponse> => {
        try {
            const response = await getConsultaPagosAfiliadoJuridico(consultaData);
            return response;
        } catch (error) {
            console.error("Error al consultar pagos para afiliado jurídico:", error);
            throw error;
        }
    };

    const generarPDFConsultaPago = async (consultaData: GenerarFacturaConsultaDTO): Promise<Blob> => {
        try {
            const response = await GenerarPDFConsultaPago(consultaData);
            return response;
        } catch (error) {
            console.error("Error al generar PDF de consulta de pago:", error);
            throw error;
        }
    };

    return {
        consultaPagosMedidor,
        consultaPagosAfiliadoFisico,
        consultaPagosAfiliadoJuridico,
        generarPDFConsultaPago,
    };
}