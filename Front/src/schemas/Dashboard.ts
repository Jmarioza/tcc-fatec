import { z } from 'zod'

export const DashboardSchema = z.object({
  dateStart: z.string(),
  dateEnd: z.string(),
  accreditorId: z.number(),
  accreditedId: z.array(z.number()).optional().or(z.number()),
  productGroupId: z.number().optional(),
  beneficiaryGroupId: z.number().optional().or(z.array(z.number())),
  beneficiarySubgroupId: z.number().optional(),
})

export type DashboardForm = z.infer<typeof DashboardSchema>
