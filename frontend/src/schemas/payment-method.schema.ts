import { z } from 'zod'

const pixConfigSchema = z.object({
  key: z.string().min(1, 'Chave PIX obrigatória').max(255, 'Máximo 255 caracteres'),
  receiverName: z.string().min(1, 'Nome do recebedor obrigatório').max(255, 'Máximo 255 caracteres'),
  receiverCity: z.string().min(1, 'Cidade obrigatória').max(255, 'Máximo 255 caracteres'),
})

const bankConfigSchema = z.object({
  bankName: z.string().min(1, 'Nome do banco obrigatório').max(255, 'Máximo 255 caracteres'),
  agency: z.string().min(1, 'Agência obrigatória').max(20, 'Agência inválida'),
  account: z.string().min(1, 'Conta obrigatória').max(20, 'Conta inválida'),
  accountType: z.string().max(20, 'Tipo de conta inválido').optional().nullable(),
})

export const createPaymentMethodSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('PIX'),
    label: z.string().min(1, 'Label obrigatório').max(255, 'Máximo 255 caracteres'),
    instructions: z.string().max(5000, 'Máximo 5000 caracteres').optional().nullable(),
    order: z.coerce.number().int().default(0),
    ...pixConfigSchema.shape,
  }),
  z.object({
    type: z.literal('BANK_TRANSFER'),
    label: z.string().min(1, 'Label obrigatório').max(255, 'Máximo 255 caracteres'),
    instructions: z.string().max(5000, 'Máximo 5000 caracteres').optional().nullable(),
    order: z.coerce.number().int().default(0),
    ...bankConfigSchema.shape,
  }),
  z.object({
    type: z.literal('CASH'),
    label: z.string().min(1, 'Label obrigatório').max(255, 'Máximo 255 caracteres'),
    instructions: z.string().max(5000, 'Máximo 5000 caracteres').optional().nullable(),
    order: z.coerce.number().int().default(0),
  }),
])

export const updatePaymentMethodSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('PIX'),
    label: z.string().min(1, 'Label obrigatório').max(255, 'Máximo 255 caracteres').optional(),
    instructions: z.string().max(5000, 'Máximo 5000 caracteres').optional().nullable(),
    order: z.coerce.number().int().optional(),
    key: z.string().max(255, 'Máximo 255 caracteres').optional(),
    receiverName: z.string().max(255, 'Máximo 255 caracteres').optional(),
    receiverCity: z.string().max(255, 'Máximo 255 caracteres').optional(),
  }),
  z.object({
    type: z.literal('BANK_TRANSFER'),
    label: z.string().min(1, 'Label obrigatório').max(255, 'Máximo 255 caracteres').optional(),
    instructions: z.string().max(5000, 'Máximo 5000 caracteres').optional().nullable(),
    order: z.coerce.number().int().optional(),
    bankName: z.string().max(255, 'Máximo 255 caracteres').optional(),
    agency: z.string().max(20, 'Agência inválida').optional(),
    account: z.string().max(20, 'Conta inválida').optional(),
    accountType: z.string().max(20, 'Tipo de conta inválido').optional().nullable(),
  }),
  z.object({
    type: z.literal('CASH'),
    label: z.string().min(1, 'Label obrigatório').max(255, 'Máximo 255 caracteres').optional(),
    instructions: z.string().max(5000, 'Máximo 5000 caracteres').optional().nullable(),
    order: z.coerce.number().int().optional(),
  }),
])

export const reorderPaymentMethodSchema = z.object({
  items: z.array(z.object({ id: z.string(), order: z.coerce.number().int() })),
})

export type CreatePaymentMethodInput = z.infer<typeof createPaymentMethodSchema>
export type UpdatePaymentMethodInput = z.infer<typeof updatePaymentMethodSchema>
export type ReorderPaymentMethodInput = z.infer<typeof reorderPaymentMethodSchema>
