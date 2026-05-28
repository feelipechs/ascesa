import { z } from 'zod'

export const createAnimalSizeSchema = z.object({
  label: z.string().min(1, 'Label obrigatório'),
  description: z.string().optional().nullable(),
  order: z.number().int().optional(),
})

export const updateAnimalSizeSchema = createAnimalSizeSchema.partial()

export type CreateAnimalSizeInput = z.infer<typeof createAnimalSizeSchema>
export type UpdateAnimalSizeInput = z.infer<typeof updateAnimalSizeSchema>
