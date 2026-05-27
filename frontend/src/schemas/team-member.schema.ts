import { z } from 'zod'

export const createTeamMemberSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  role: z.string().min(1, 'Cargo obrigatório'),
  bio: z.string().optional(),
  photoUrl: z.string().optional(),
  order: z.coerce.number().int().default(0),
  publishedAt: z.string().datetime().optional(),
  areaIds: z.array(z.string()).default([]),
})

export const updateTeamMemberSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.string().min(1).optional(),
  bio: z.string().optional(),
  photoUrl: z.string().optional(),
  order: z.coerce.number().int().optional(),
  publishedAt: z.string().datetime().nullable().optional(),
  areaIds: z.array(z.string()).optional(),
})

export type CreateTeamMemberInput = z.infer<typeof createTeamMemberSchema>
export type UpdateTeamMemberInput = z.infer<typeof updateTeamMemberSchema>
