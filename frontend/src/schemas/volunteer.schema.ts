import { z } from 'zod'
import { dateInputToISO } from '@/lib/utils-date'

export const createVolunteerSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  birthDate: z.preprocess(
    (v) => (typeof v === 'string' && v.trim() !== '' ? dateInputToISO(v) : null),
    z.string().datetime().nullable().optional(),
  ),
})

export const updateVolunteerSchema = createVolunteerSchema.partial()

export type CreateVolunteerInput = z.infer<typeof createVolunteerSchema>
export type UpdateVolunteerInput = z.infer<typeof updateVolunteerSchema>
