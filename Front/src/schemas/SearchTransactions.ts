import { z } from 'zod'

export const AccreditedSchema = z.object({
  companyId: z.number(),
  accreditorId: z.number(),
  status: z.enum(['ENABLED', 'DISABLED']),
  services: z.array(
    z.object({
      contractId: z.number(),
      status: z.enum(['ENABLED', 'DISABLED']),
    }),
  ),
})

export type AccreditedForm = z.infer<typeof AccreditedSchema>

/*  accreditorId?: number
  accreditedId?: number
  productId?: number
  productGroupId?: number
  cpfBeneficiary?: string
  localTransactionReference?: string
  dateStart?: string
  dateEnd?: string */
