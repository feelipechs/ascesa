import { z } from 'zod'

export const createAnimalSizeSchema = z.object({
  label: z.string().min(1, 'Label obrigatório'),
  description: z.string().optional().nullable(),
  order: z.coerce.number().int().optional(),
})

export const updateAnimalSizeSchema = createAnimalSizeSchema.partial()

export type CreateAnimalSizeInput = z.infer<typeof createAnimalSizeSchema>
export type UpdateAnimalSizeInput = z.infer<typeof updateAnimalSizeSchema>

export const reorderAnimalSizeSchema = z.object({
  items: z.array(z.object({ id: z.string(), order: z.coerce.number().int() })),
})

export type ReorderAnimalSizeInput = z.infer<typeof reorderAnimalSizeSchema>
