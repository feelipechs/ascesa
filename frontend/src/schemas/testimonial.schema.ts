import { z } from 'zod'

export const createTestimonialSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  role: z.string().optional(),
  message: z.string().min(1, 'Mensagem obrigatória'),
  projectId: z.string().min(1, 'Projeto obrigatório'),
})

export const updateTestimonialSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.string().optional(),
  message: z.string().min(1).optional(),
  projectId: z.string().optional(),
})

export type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>
export type UpdateTestimonialInput = z.infer<typeof updateTestimonialSchema>
