import { z } from 'zod'

export const createTestimonialSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  role: z.string().optional(),
  message: z.string().min(1, 'Mensagem obrigatória'),
})

export const updateTestimonialSchema = createTestimonialSchema.partial()

export type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>
export type UpdateTestimonialInput = z.infer<typeof updateTestimonialSchema>
