import { z } from 'zod'
import { dateInputToISO } from '@/lib/utils-date'

export const createFiscalNoteSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('DETAILED'),
    cnpj: z.string().min(1, 'CNPJ é obrigatório').max(18, 'CNPJ inválido'),
    emissionDate: z.preprocess(
      (v) => (typeof v === 'string' && v.trim() !== '' ? dateInputToISO(v) : undefined),
      z.string().datetime().optional(),
    ),
    coo: z.string().min(1, 'COO é obrigatório').max(50, 'COO inválido'),
    amount: z.number().positive('Valor deve ser positivo'),
  }),
  z.object({
    type: z.literal('ACCESS_KEY'),
    accessKey: z.string().length(44, 'Chave de acesso deve ter 44 dígitos'),
  }),
])

export type CreateFiscalNoteInput = z.infer<typeof createFiscalNoteSchema>
