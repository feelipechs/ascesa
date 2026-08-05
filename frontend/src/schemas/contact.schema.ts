import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(255, 'Máximo 255 caracteres'),
  email: z.string().email('Email inválido').max(255, 'Máximo 255 caracteres'),
  subject: z.string().min(1, 'Assunto é obrigatório').max(255, 'Máximo 255 caracteres'),
  message: z.string().min(1, 'Mensagem é obrigatória').max(2000, 'Máximo 2000 caracteres'),
})

export type ContactInput = z.infer<typeof contactSchema>
