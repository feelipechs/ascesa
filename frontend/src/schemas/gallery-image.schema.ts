import { z } from 'zod'
import { GalleryContext } from '@/generated/prisma/enums'

const baseGalleryImageSchema = z.object({
  mediaId: z.string().min(1, 'Imagem obrigatória'),
  caption: z.string().optional(),
  context: z.nativeEnum(GalleryContext).default('PROJECT'),
  projectId: z.string().nullable().optional(),
  animalId: z.string().nullable().optional(),
})

export const createGalleryImageSchema = baseGalleryImageSchema
  .refine(
    (data) => data.context !== 'PROJECT' || data.projectId,
    { message: 'projectId é obrigatório quando context é PROJECT', path: ['projectId'] }
  )
  .refine(
    (data) => data.context !== 'ANIMAL' || data.animalId,
    { message: 'animalId é obrigatório quando context é ANIMAL', path: ['animalId'] }
  )

export const updateGalleryImageSchema = baseGalleryImageSchema.partial().extend({
  order: z.coerce.number().int().optional(),
})

export const reorderGalleryImageSchema = z.object({
  items: z.array(z.object({ id: z.string(), order: z.coerce.number().int() })),
})

export type CreateGalleryImageInput = z.infer<typeof createGalleryImageSchema>
export type UpdateGalleryImageInput = z.infer<typeof updateGalleryImageSchema>
export type ReorderGalleryImageInput = z.infer<typeof reorderGalleryImageSchema>
