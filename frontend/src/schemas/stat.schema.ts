import { z } from 'zod'

export const createStatSchema = z.object({
  label: z.string().min(1, 'Label obrigatório').max(255, 'Máximo 255 caracteres'),
  value: z.string().min(1, 'Valor obrigatório').max(255, 'Máximo 255 caracteres'),
})

export const updateStatSchema = createStatSchema.partial()

export const reorderStatSchema = z.object({
  items: z.array(z.object({ id: z.string(), order: z.coerce.number().int() })),
})

export type CreateStatInput = z.infer<typeof createStatSchema>
export type UpdateStatInput = z.infer<typeof updateStatSchema>
export type ReorderStatInput = z.infer<typeof reorderStatSchema>
