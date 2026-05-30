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
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  message: z.string().optional(),
  projectId: z.string().min(1),
})

export type CreateRegistrationInput = z.infer<typeof createRegistrationSchema>
export type UpdateRegistrationInput = z.infer<typeof updateRegistrationSchema>
export type PublicRegistrationInput = z.infer<typeof publicRegistrationSchema>
