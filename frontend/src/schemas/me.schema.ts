import { z } from 'zod'

export const updateMeSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('Email inválido').optional(),
})

export type UpdateMeInput = z.infer<typeof updateMeSchema>
