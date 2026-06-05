import { z } from 'zod'

export const createTeamMemberSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  role: z.string().min(1, 'Cargo obrigatório'),
  bio: z.string().optional(),
  photoMediaId: z.string().optional().or(z.literal('')),
  order: z.coerce.number().int().default(0),
  areaIds: z.array(z.string()).default([]),
})

export const updateTeamMemberSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório').optional(),
  role: z.string().min(1, 'Cargo obrigatório').optional(),
  bio: z.string().optional(),
  photoMediaId: z.string().nullable().optional(),
  order: z.coerce.number().int().optional(),
  areaIds: z.array(z.string()).optional(),
})

export type CreateTeamMemberInput = z.infer<typeof createTeamMemberSchema>
export type UpdateTeamMemberInput = z.infer<typeof updateTeamMemberSchema>

export const reorderTeamMemberSchema = z.object({
  items: z.array(z.object({ id: z.string(), order: z.coerce.number().int() })),
})

export type ReorderTeamMemberInput = z.infer<typeof reorderTeamMemberSchema>
