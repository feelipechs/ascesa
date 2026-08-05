import { z } from 'zod'

export const createRegistrationSchema = z.object({
  message: z.string().optional(),
  volunteerId: z.string().min(1, 'Voluntário obrigatório'),
  projectId: z.string().min(1, 'Projeto obrigatório'),
})

export const updateRegistrationSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED'], { message: 'Status inválido' }),
  message: z.string().optional(),
})

export const publicRegistrationSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(255, 'Máximo 255 caracteres'),
  email: z.string().email('Email inválido').max(255, 'Máximo 255 caracteres'),
  phone: z.string().max(20, 'Telefone inválido').optional(),
  message: z.string().max(2000, 'Máximo 2000 caracteres').optional(),
  projectId: z.string().min(1),
})

export type CreateRegistrationInput = z.infer<typeof createRegistrationSchema>
export type UpdateRegistrationInput = z.infer<typeof updateRegistrationSchema>
export type PublicRegistrationInput = z.infer<typeof publicRegistrationSchema>
