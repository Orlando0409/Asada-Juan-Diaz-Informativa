import { z } from 'zod'

export const AsociadoJuridicaSchema = z.object({
    
})

export type AsociadoJuridica = z.infer<typeof AsociadoJuridicaSchema>