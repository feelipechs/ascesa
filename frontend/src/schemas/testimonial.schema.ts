import { z } from 'zod'

export const createTestimonialSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  role: z.string().optional(),
  message: z.string().min(1, 'Mensagem obrigatória'),
  photoUrl: z.string().url().optional().nullable(),
  featured: z.boolean().default(false),
  publishedAt: z.string().datetime({ offset: true }).optional().nullable(),
})

export const updateTestimonialSchema = createTestimonialSchema.partial()

export type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>
export type UpdateTestimonialInput = z.infer<typeof updateTestimonialSchema>
