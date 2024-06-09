import { z } from 'zod'

export const UserSchema = z.object({
  name: z.string().nonempty({ message: 'Campo obrigatório' }),
  username: z
    .string()
    .email({ message: 'Formato de e-mail inválido.' })
    .nonempty({ message: 'Campo obrigatório' }),
  status: z.enum(['ENABLED', 'DISABLED']),
})

export type UserForm = z.infer<typeof UserSchema>
