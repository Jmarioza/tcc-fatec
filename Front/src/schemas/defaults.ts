import { sanitize } from '@/func/sanitize'
import { cnpj, cpf } from 'cpf-cnpj-validator'
import { z } from 'zod'

export const passwordForm = z
  .object({
    password: z.string().nonempty('A senha é obrigatória.'),
    confirm: z.string().nonempty('A confirmação de senha é obrigatória.'),
  })
  .refine((value) => value.confirm === value.password, {
    message: 'As senhas devem coincidir.',
    path: ['confirm'],
  })

export const optional = <T>(schema: z.ZodType<T>, message?: string) =>
  z
    .union([z.string(), z.undefined()])
    .refine((val) => !val || schema.safeParse(val).success, { message })

export const isCNPJ = z
  .string()
  .transform((value) => sanitize(value))
  .refine((value) => cnpj.isValid(value), {
    message: 'Formato de CNPJ inválido.',
  })

export const isCPF = z
  .string()
  .transform((value) => sanitize(value))
  .refine((value) => cpf.isValid(value), {
    message: 'Formato de CPF inválido.',
  })
