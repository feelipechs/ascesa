import { z } from 'zod'

export const updateUserPasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual obrigatória'),
  newPassword: z.string().min(6, 'Mínimo 6 caracteres'),
})

export type UpdateUserPasswordInput = z.infer<typeof updateUserPasswordSchema>
