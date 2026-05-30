import { z } from 'zod'

export const createAnimalSpeciesSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  order: z.coerce.number().int().optional(),
})

export const updateAnimalSpeciesSchema = createAnimalSpeciesSchema.partial()

export type CreateAnimalSpeciesInput = z.infer<typeof createAnimalSpeciesSchema>
export type UpdateAnimalSpeciesInput = z.infer<typeof updateAnimalSpeciesSchema>
