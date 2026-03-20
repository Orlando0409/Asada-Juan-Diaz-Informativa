import apiAuth from "../../api/apiAuth";
import type {
    ConsultaFisicaDTO,
    ConsultaFisicaResponse,
    ConsultaMedidorResponse,
    ConsultaJuridicaDTO,
    ConsultaJuridicaResponse,
} from "../../types/Consulta/Pagos";

export const getConsultaPagosMedidor = async (numeroMedidor: number) => {
    const response = await apiAuth.get<ConsultaMedidorResponse>(`/consulta-pagos/medidor/${numeroMedidor}`);
    return response.data;
}

export const getConsultaPagosAfiliadoFisico = async (consultaData: ConsultaFisicaDTO) => {
    const response = await apiAuth.post<ConsultaFisicaResponse>(`/consulta-pagos/afiliado-fisico`, consultaData);
    return response.data;
}

export const getConsultaPagosAfiliadoJuridico = async (consultaData: ConsultaJuridicaDTO) => {
    const response = await apiAuth.post<ConsultaJuridicaResponse>(`/consulta-pagos/afiliado-juridico`, consultaData);
    return response.data;
}