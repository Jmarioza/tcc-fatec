import { z } from 'zod'

export const UserSchema = z.object({
  name: z.string().nonempty({ message: 'Campo obrigatório' }),
  username: z
    .string()
    .email({ message: 'Formato de e-mail inválido.' })
    .nonempty({ message: 'Campo obrigatório' }),
  status: z.enum(['ENABLED', 'DISABLED']),
  password: z
    .object({
      password: z
        .string()
        .min(6, { message: 'A senha deve conter no mínimo 6 caracteres.' }),
      confirm: z.string(),
    })
    .refine((value) => value.confirm === value.password, {
      message: 'As senhas devem coincidir.',
      path: ['confirm'],
    }),
  roles: z.array(
    z.object({
      status: z.enum(['ENABLED', 'DISABLED']),
      companyId: z.number(),
      typeUser: z.enum([
        'SYSTEM',
        'ACCREDITED',
        'ACCREDITOR',
        'LIMITED_ACCREDITOR',
        'MASTER_ACCREDITED',
      ]),
    }),
  ),
})

export type UserForm = z.infer<typeof UserSchema>
