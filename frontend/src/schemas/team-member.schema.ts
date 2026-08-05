import { z } from 'zod'

export const createTeamMemberSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório').max(255, 'Máximo 255 caracteres'),
  role: z.string().min(1, 'Cargo obrigatório').max(255, 'Máximo 255 caracteres'),
  bio: z.string().max(5000, 'Máximo 5000 caracteres').optional(),
  photoMediaId: z.string().optional().or(z.literal('')),
  areaIds: z.array(z.string()).default([]),
})

export const updateTeamMemberSchema = createTeamMemberSchema.partial().extend({
  order: z.coerce.number().int().optional(),
})

export type CreateTeamMemberInput = z.infer<typeof createTeamMemberSchema>
export type UpdateTeamMemberInput = z.infer<typeof updateTeamMemberSchema>

export const reorderTeamMemberSchema = z.object({
  items: z.array(z.object({ id: z.string(), order: z.coerce.number().int() })),
})

export type ReorderTeamMemberInput = z.infer<typeof reorderTeamMemberSchema>
