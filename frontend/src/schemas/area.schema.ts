import { z } from 'zod'

export const createAreaSchema = z.object({
  title: z.string().min(1, 'Título obrigatório').max(255, 'Máximo 255 caracteres'),
  slug: z.string().min(1, 'Slug obrigatório').regex(/^[a-z0-9-]+$/, 'Formato de slug inválido').max(100, 'Máximo 100 caracteres'),
  description: z.string().max(500, 'Máximo 500 caracteres').optional(),
  coverMediaId: z.string().optional().or(z.literal('')),
  iconName: z.string().nullable().optional(),
})

export const updateAreaSchema = createAreaSchema.partial()

export type CreateAreaInput = z.infer<typeof createAreaSchema>
export type UpdateAreaInput = z.infer<typeof updateAreaSchema>
