import { z } from 'zod'

export const updateMeSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('Email inválido').optional(),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres').optional(),
})

export type UpdateMeInput = z.infer<typeof updateMeSchema>
