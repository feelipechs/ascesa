import { z } from 'zod'

export const createStatSchema = z.object({
  label: z.string().min(1, 'Label obrigatório'),
  value: z.string().min(1, 'Valor obrigatório'),
  order: z.coerce.number().int().optional(),
  publishedAt: z.string().datetime({ offset: true }).nullable().optional(),
})

export const updateStatSchema = createStatSchema.partial()

export const reorderStatSchema = z.object({
  items: z.array(z.object({ id: z.string(), order: z.coerce.number().int() })),
})

export type CreateStatInput = z.infer<typeof createStatSchema>
export type UpdateStatInput = z.infer<typeof updateStatSchema>
export type ReorderStatInput = z.infer<typeof reorderStatSchema>
