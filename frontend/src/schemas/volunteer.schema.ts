import { z } from 'zod'

export const createVolunteerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  birthDate: z.string().datetime().nullable().optional(),
})

export const updateVolunteerSchema = createVolunteerSchema.partial()

export type CreateVolunteerInput = z.infer<typeof createVolunteerSchema>
export type UpdateVolunteerInput = z.infer<typeof updateVolunteerSchema>
