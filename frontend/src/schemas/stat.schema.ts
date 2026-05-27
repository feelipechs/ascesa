import { z } from 'zod'

export const createStatSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  order: z.number().int().optional(),
  publishedAt: z.string().datetime().nullable().optional(),
})

export const updateStatSchema = createStatSchema.partial()

export type CreateStatInput = z.infer<typeof createStatSchema>
export type UpdateStatInput = z.infer<typeof updateStatSchema>
