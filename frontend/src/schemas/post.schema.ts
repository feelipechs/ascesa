import { z } from 'zod'

export const createPostSchema = z.object({
  title: z.string().min(1, 'Título obrigatório'),
  slug: z.string().min(1, 'Slug obrigatório'),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  coverMediaId: z.string().optional().or(z.literal('')),
  author: z.string().optional(),
  publishedAt: z.preprocess(
    (v) => (v === '' || v === undefined ? null : v),
    z.string().datetime().nullable().optional(),
  ),
})

export const updatePostSchema = createPostSchema.partial()

export type CreatePostInput = z.infer<typeof createPostSchema>
export type UpdatePostInput = z.infer<typeof updatePostSchema>
