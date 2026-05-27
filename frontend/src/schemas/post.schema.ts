import { z } from 'zod'

export const createPostSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  coverUrl: z.string().optional(),
  author: z.string().optional(),
  publishedAt: z.string().datetime().nullable().optional(),
})

export const updatePostSchema = createPostSchema.partial()

export type CreatePostInput = z.infer<typeof createPostSchema>
export type UpdatePostInput = z.infer<typeof updatePostSchema>
