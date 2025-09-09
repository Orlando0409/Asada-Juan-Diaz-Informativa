import { z } from 'zod'

export const CambioMedidorJuridicaSchema = z.object({

})

export type CambioMedidorJuridica = z.infer<typeof CambioMedidorJuridicaSchema>