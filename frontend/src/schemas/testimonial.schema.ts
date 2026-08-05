import { z } from 'zod'

export const createTestimonialSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório').max(255, 'Máximo 255 caracteres'),
  role: z.string().max(255, 'Máximo 255 caracteres').optional(),
  message: z.string().min(1, 'Mensagem obrigatória').max(5000, 'Máximo 5000 caracteres'),
})

export const updateTestimonialSchema = createTestimonialSchema.partial()

export type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>
export type UpdateTestimonialInput = z.infer<typeof updateTestimonialSchema>
