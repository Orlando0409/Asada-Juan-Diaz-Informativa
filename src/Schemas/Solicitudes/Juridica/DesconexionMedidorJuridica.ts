import { z } from 'zod'

export const DesconexionMedidorJuridicaSchema = z.object({

})

export type DesconexionMedidorJuridica = z.infer<typeof DesconexionMedidorJuridicaSchema>