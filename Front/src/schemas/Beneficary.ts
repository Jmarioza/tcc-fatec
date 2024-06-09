import { z } from 'zod'
import { isCPF } from './defaults'

export const BeneficiarySchema = z.object({
  name: z.string().nonempty({ message: 'Campo obrigatório.' }),
  cpf: isCPF,
  beneficiaryGroupId: z.number().min(1, { message: 'Campo obrigatório.' }),
  beneficiarySubgroupId: z.number().min(1, { message: 'Campo obrigatório.' }),
  accreditorId: z.number().min(1, { message: 'Campo obrigatório.' }),
  codeRef: z.string().optional(),
  status: z.enum(['ENABLED', 'DISABLED']),
})

export type BeneficiaryForm = z.infer<typeof BeneficiarySchema>
