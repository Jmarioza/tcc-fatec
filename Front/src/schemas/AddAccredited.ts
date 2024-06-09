import { z } from 'zod'
import { optional } from './defaults'

export const AccreditedSchema = z.object({
  companyId: z.number(),
  accreditorId: z.number(),
  status: z.enum(['ENABLED', 'DISABLED']),
  contactName: z.string().optional(),
  contactPhoneNumber: z.string().optional(),
  contactEmail: optional(z.string().email(), 'Formato de E-mail inválido.'),
  services: z.array(
    z.object({
      contractId: z.number(),
      status: z.enum(['ENABLED', 'DISABLED']),
    }),
  ),
})

export type AccreditedForm = z.infer<typeof AccreditedSchema>
