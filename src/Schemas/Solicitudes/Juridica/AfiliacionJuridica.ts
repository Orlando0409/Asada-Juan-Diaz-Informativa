import { z } from 'zod'

export const AfiliacionSchema = z.object({

})

export type Afiliacion = z.infer<typeof AfiliacionSchema>