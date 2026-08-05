import { z } from 'zod'
import { AnimalSpecies, AnimalSize, AnimalAgeRange, AnimalGender, AnimalStatus } from '@/generated/prisma/enums'
import { zodBoolean } from '@/schemas/helpers'

export const animalFiltersSchema = z.object({
  species: z.nativeEnum(AnimalSpecies).optional(),
  size: z.nativeEnum(AnimalSize).optional(),
  ageRange: z.nativeEnum(AnimalAgeRange).optional(),
  gender: z.nativeEnum(AnimalGender).optional(),
  status: z.nativeEnum(AnimalStatus).optional(),
  search: z.string().optional(),
  featured: zodBoolean.optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
})

export type AnimalFiltersInput = z.infer<typeof animalFiltersSchema>
