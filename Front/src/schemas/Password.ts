import { z } from 'zod'

export const PasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: 'A senha deve conter no mínimo 6 caracteres.' }),
    confirm: z.string().optional(),
  })
  .refine((value) => value.confirm === value.password, {
    message: 'As senhas devem coincidir.',
    path: ['confirm'],
  })

export type PasswordForm = z.infer<typeof PasswordSchema>
