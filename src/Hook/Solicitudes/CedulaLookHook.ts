import { useState } from "react"
import { fetchCedulaData, fetchCedulaJuridicaData } from "../../Services/Solicitudes/CedulaApiService"

export function useCedulaLookup() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const lookup = async (cedula: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const persona = await fetchCedulaData(cedula)
      return persona
    } catch (err: any) {
      setError(err.message || "Error desconocido")
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const lookupJuridica = async (cedulaJuridica: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const razonSocial = await fetchCedulaJuridicaData(cedulaJuridica)
      return razonSocial
    } catch (err: any) {
      setError(err.message || "Error desconocido")
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { lookup, lookupJuridica, isLoading, error }
}