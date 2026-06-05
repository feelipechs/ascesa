import { z } from 'zod'
import { AnimalGender, AnimalStatus, AnimalSpecies, AnimalSize, AnimalAgeRange } from '@/generated/prisma/enums'
import { dateInputToISO } from '@/lib/utils-date'

export const createAnimalSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  species: z.nativeEnum(AnimalSpecies),
  breed: z.string().optional().nullable(),
  gender: z.nativeEnum(AnimalGender),
  size: z.nativeEnum(AnimalSize).optional().nullable(),
  birthDate: z.preprocess(
    (v) => (typeof v === 'string' && v.trim() !== '' ? dateInputToISO(v) : null),
    z.string().datetime().nullable().optional(),
  ),
  ageRange: z.nativeEnum(AnimalAgeRange).optional().nullable(),
  description: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  coverMediaId: z.string().optional().nullable(),
  status: z.nativeEnum(AnimalStatus).default('AVAILABLE'),
  featured: z.boolean().default(false),
})

export const updateAnimalSchema = createAnimalSchema.partial()

export type CreateAnimalInput = z.infer<typeof createAnimalSchema>
export type UpdateAnimalInput = z.infer<typeof updateAnimalSchema>
