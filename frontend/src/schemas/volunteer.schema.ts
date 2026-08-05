import { z } from 'zod'

export const createVolunteerSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório').max(255, 'Máximo 255 caracteres'),
  email: z.string().email('Email inválido').max(255, 'Máximo 255 caracteres'),
  phone: z.string().max(20, 'Telefone inválido').optional(),
})

export const updateVolunteerSchema = createVolunteerSchema.partial()

export type CreateVolunteerInput = z.infer<typeof createVolunteerSchema>
export type UpdateVolunteerInput = z.infer<typeof updateVolunteerSchema>
