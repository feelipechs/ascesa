import { z } from 'zod'

export const createPaymentMethodSchema = z.object({
  type: z.enum(['PIX', 'BANK_TRANSFER', 'CASH']),
  label: z.string().min(1, 'Label obrigatório'),
  instructions: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  displayOrder: z.coerce.number().int().default(0),
  key: z.string().optional(),
  receiverName: z.string().optional(),
  receiverCity: z.string().optional(),
  bankName: z.string().optional(),
  agency: z.string().optional(),
  account: z.string().optional(),
  accountType: z.string().optional().nullable(),
})

export const updatePaymentMethodSchema = createPaymentMethodSchema.partial()

export const reorderPaymentMethodSchema = z.object({
  items: z.array(z.object({ id: z.string(), displayOrder: z.coerce.number().int() })),
})

export type CreatePaymentMethodInput = z.infer<typeof createPaymentMethodSchema>
export type UpdatePaymentMethodInput = z.infer<typeof updatePaymentMethodSchema>
export type ReorderPaymentMethodInput = z.infer<typeof reorderPaymentMethodSchema>
