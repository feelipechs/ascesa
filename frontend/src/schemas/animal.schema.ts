import { z } from 'zod'
import { AnimalGender, AnimalStatus } from '@/generated/prisma/enums'

export const createAnimalSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  speciesId: z.string().min(1),
  breed: z.string().optional().nullable(),
  gender: z.nativeEnum(AnimalGender),
  sizeId: z.string().optional().nullable(),
  birthDate: z.string().datetime({ offset: true }).optional().nullable(),
  ageRangeId: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  coverUrl: z.string().url().optional().nullable(),
  status: z.nativeEnum(AnimalStatus).default('AVAILABLE'),
  featured: z.boolean().default(false),
  publishedAt: z.string().datetime({ offset: true }).optional().nullable(),
})

export const updateAnimalSchema = createAnimalSchema.partial()

export type CreateAnimalInput = z.infer<typeof createAnimalSchema>
export type UpdateAnimalInput = z.infer<typeof updateAnimalSchema>
