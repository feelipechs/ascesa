import { z } from 'zod'

export const createFiscalNoteSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('DETAILED'),
    cnpj: z.string().min(1, 'CNPJ é obrigatório'),
    emissionDate: z.string().datetime({ offset: true }).optional(),
    coo: z.string().min(1, 'COO é obrigatório'),
    amount: z.number().positive('Valor deve ser positivo'),
  }),
  z.object({
    type: z.literal('ACCESS_KEY'),
    accessKey: z.string().length(44, 'Chave de acesso deve ter 44 dígitos'),
  }),
])

export const updateFiscalNoteSchema = z.object({
  type: z.enum(['DETAILED', 'ACCESS_KEY']).optional(),
  cnpj: z.string().optional(),
  emissionDate: z.string().datetime({ offset: true }).optional().nullable(),
  coo: z.string().optional(),
  amount: z.number().positive().optional().nullable(),
  accessKey: z.string().optional(),
})

export type CreateFiscalNoteInput = z.infer<typeof createFiscalNoteSchema>
export type UpdateFiscalNoteInput = z.infer<typeof updateFiscalNoteSchema>
