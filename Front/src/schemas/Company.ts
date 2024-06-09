import { z } from 'zod'
import { optional, isCNPJ, isCPF } from './defaults'

export const CompanySchema = z.object({
  typePerson: z.enum(['PHYSICAL', 'LEGAL']),
  cnpj: optional(isCNPJ, 'Formato CNPJ inválido'),
  cpf: optional(isCPF, 'Formato CPF inválido.'),
  name: z.string().optional(),
  ie: z.string().optional(),
  im: z.string().optional(),
  cnae: optional(
    z.string().refine((value) => /^\d+$/.test(value), {
      message: 'Campo CNAE possui somente números',
    }),
    'Campo CNAE possui somente números',
  ),
  taxRegime: z.enum(['NORMAL_REGIME', 'SIMPLE_NATIONAL']),
  corporateReason: z.string().nonempty({ message: 'Campo obrigatório.' }),
  rg: z.string().optional(),
  personResponsible: z.string().optional(),
  cpfPersonResponsible: optional(isCPF, 'Formato CPF inválido.'),
  city: z.string().optional(),
  cep: z.string().optional(),
  complement: z.string().optional(),
  address: z.string().optional(),
  neighborhood: z.string().optional(),
  addressNumber: z.string().optional(),
  uf: z.string().optional(),
  country: z.string().optional(),
  phoneNumber: z.string().optional(),
  extension: z.string().optional(),
  email: optional(z.string().email(), 'Formato de E-mail inválido.'),
  site: optional(z.string().url(), 'URL do Website é inválida.'),
  status: z.enum(['ENABLED', 'DISABLED']),
})

export type CompanyForm = z.infer<typeof CompanySchema>
