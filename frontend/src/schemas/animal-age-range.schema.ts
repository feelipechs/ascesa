import { z } from 'zod'

export const createAnimalAgeRangeSchema = z.object({
  label: z.string().min(1, 'Label obrigatório'),
  minAge: z.number().int().optional().nullable(),
  maxAge: z.number().int().optional().nullable(),
  order: z.coerce.number().int().optional(),
})

export const updateAnimalAgeRangeSchema = createAnimalAgeRangeSchema.partial()

export type CreateAnimalAgeRangeInput = z.infer<typeof createAnimalAgeRangeSchema>
export type UpdateAnimalAgeRangeInput = z.infer<typeof updateAnimalAgeRangeSchema>
