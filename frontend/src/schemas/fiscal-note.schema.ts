import { z } from 'zod'

export const createFiscalNoteSchema = z.object({
  type: z.enum(['DETAILED', 'ACCESS_KEY']),
  cnpj: z.string().optional(),
  emissionDate: z.string().datetime({ offset: true }).optional(),
  coo: z.string().optional(),
  amount: z.number().positive().optional(),
  accessKey: z.string().optional(),
})

export const updateFiscalNoteSchema = createFiscalNoteSchema.partial()

export type CreateFiscalNoteInput = z.infer<typeof createFiscalNoteSchema>
export type UpdateFiscalNoteInput = z.infer<typeof updateFiscalNoteSchema>
