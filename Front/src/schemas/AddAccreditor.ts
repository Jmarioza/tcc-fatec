import { z } from 'zod'

export const AccreditorSchema = z.object({
  companyId: z.number(),
  status: z.enum(['ENABLED', 'DISABLED']),
  contracts: z.array(
    z.object({
      serviceId: z.number(),
      status: z.enum(['ENABLED', 'DISABLED']),
      commissionType: z.enum(['PERCENTAGE', 'VALUE']),
      commission: z.number(),
      maximumCharge: z.number(),
    }),
  ),
})

export type AccreditorForm = z.infer<typeof AccreditorSchema>
