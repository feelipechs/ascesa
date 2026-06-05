import { z } from 'zod'

const pixConfigSchema = z.object({
  key: z.string().min(1, 'Chave PIX obrigatória'),
  receiverName: z.string().min(1, 'Nome do recebedor obrigatório'),
  receiverCity: z.string().min(1, 'Cidade obrigatória'),
})

const bankConfigSchema = z.object({
  bankName: z.string().min(1, 'Nome do banco obrigatório'),
  agency: z.string().min(1, 'Agência obrigatória'),
  account: z.string().min(1, 'Conta obrigatória'),
  accountType: z.string().optional().nullable(),
})

export const createPaymentMethodSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('PIX'),
    label: z.string().min(1, 'Label obrigatório'),
    instructions: z.string().optional().nullable(),
    isActive: z.boolean().default(true),
    displayOrder: z.coerce.number().int().default(0),
    ...pixConfigSchema.shape,
  }),
  z.object({
    type: z.literal('BANK_TRANSFER'),
    label: z.string().min(1, 'Label obrigatório'),
    instructions: z.string().optional().nullable(),
    isActive: z.boolean().default(true),
    displayOrder: z.coerce.number().int().default(0),
    ...bankConfigSchema.shape,
  }),
  z.object({
    type: z.literal('CASH'),
    label: z.string().min(1, 'Label obrigatório'),
    instructions: z.string().optional().nullable(),
    isActive: z.boolean().default(true),
    displayOrder: z.coerce.number().int().default(0),
  }),
])

export const updatePaymentMethodSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('PIX'),
    label: z.string().min(1, 'Label obrigatório').optional(),
    instructions: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
    displayOrder: z.coerce.number().int().optional(),
    key: z.string().optional(),
    receiverName: z.string().optional(),
    receiverCity: z.string().optional(),
  }),
  z.object({
    type: z.literal('BANK_TRANSFER'),
    label: z.string().min(1, 'Label obrigatório').optional(),
    instructions: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
    displayOrder: z.coerce.number().int().optional(),
    bankName: z.string().optional(),
    agency: z.string().optional(),
    account: z.string().optional(),
    accountType: z.string().optional().nullable(),
  }),
  z.object({
    type: z.literal('CASH'),
    label: z.string().min(1, 'Label obrigatório').optional(),
    instructions: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
    displayOrder: z.coerce.number().int().optional(),
  }),
])

export const reorderPaymentMethodSchema = z.object({
  items: z.array(z.object({ id: z.string(), displayOrder: z.coerce.number().int() })),
})

export type CreatePaymentMethodInput = z.infer<typeof createPaymentMethodSchema>
export type UpdatePaymentMethodInput = z.infer<typeof updatePaymentMethodSchema>
export type ReorderPaymentMethodInput = z.infer<typeof reorderPaymentMethodSchema>
