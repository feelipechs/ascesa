import { z } from 'zod'

export const createVolunteerSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
})

export const updateVolunteerSchema = createVolunteerSchema.partial()

export type CreateVolunteerInput = z.infer<typeof createVolunteerSchema>
export type UpdateVolunteerInput = z.infer<typeof updateVolunteerSchema>
