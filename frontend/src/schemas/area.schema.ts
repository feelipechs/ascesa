import { z } from 'zod'

export const createAreaSchema = z.object({
  title: z.string().min(1, 'Título obrigatório'),
  slug: z.string().min(1, 'Slug obrigatório'),
  description: z.string().optional(),
  coverMediaId: z.string().optional().or(z.literal('')),
  iconName: z.string().nullable().optional(),
})

export const updateAreaSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  coverMediaId: z.string().nullable().optional(),
  iconName: z.string().nullable().optional(),
})

export type CreateAreaInput = z.infer<typeof createAreaSchema>
export type UpdateAreaInput = z.infer<typeof updateAreaSchema>
