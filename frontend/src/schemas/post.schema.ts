import { z } from 'zod'

export const createPostSchema = z.object({
  title: z.string().min(1, 'Título obrigatório').max(255, 'Máximo 255 caracteres'),
  slug: z.string().min(1, 'Slug obrigatório').regex(/^[a-z0-9-]+$/, 'Formato de slug inválido').max(100, 'Máximo 100 caracteres'),
  excerpt: z.string().max(500, 'Máximo 500 caracteres').optional(),
  content: z.string().optional(),
  coverMediaId: z.string().optional().or(z.literal('')),
  author: z.string().max(255, 'Máximo 255 caracteres').optional(),
  publishedAt: z.preprocess(
    (v) => (v === '' || v === undefined ? null : v),
    z.string().datetime().nullable().optional(),
  ),
})

export const updatePostSchema = createPostSchema.partial()

export type CreatePostInput = z.infer<typeof createPostSchema>
export type UpdatePostInput = z.infer<typeof updatePostSchema>
