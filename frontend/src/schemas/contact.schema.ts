import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  subject: z.string().min(1, 'Assunto é obrigatório'),
  message: z.string().min(1, 'Mensagem é obrigatória'),
})

export type ContactInput = z.infer<typeof contactSchema>
