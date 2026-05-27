import { z } from 'zod'
import { GalleryContext } from '@/generated/prisma/enums'

export const createGalleryImageSchema = z.object({
  url: z.string().min(1, 'URL obrigatória'),
  caption: z.string().optional(),
  order: z.coerce.number().int().default(0),
  context: z.nativeEnum(GalleryContext).default('PROJECT'),
  projectId: z.string().nullable().optional(),
}).refine(
  (data) => data.context !== 'PROJECT' || data.projectId,
  { message: 'projectId é obrigatório quando context é PROJECT', path: ['projectId'] }
)

export const updateGalleryImageSchema = z.object({
  url: z.string().min(1).optional(),
  caption: z.string().optional(),
  order: z.coerce.number().int().optional(),
  context: z.nativeEnum(GalleryContext).optional(),
  projectId: z.string().nullable().optional(),
})

export type CreateGalleryImageInput = z.infer<typeof createGalleryImageSchema>
export type UpdateGalleryImageInput = z.infer<typeof updateGalleryImageSchema>
