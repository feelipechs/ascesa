import { z } from 'zod'

export const createPartnerSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  logoUrl: z.string().url('URL do logo inválida'),
  websiteUrl: z.string().url('URL do site inválida').optional().or(z.literal('')),
  publishedAt: z.string().datetime({ offset: true }).optional(),
})

export const updatePartnerSchema = z.object({
  name: z.string().min(1).optional(),
  logoUrl: z.string().url('URL do logo inválida').optional().or(z.literal('')),
  websiteUrl: z.string().url('URL do site inválida').optional().or(z.literal('')),
  publishedAt: z.string().datetime({ offset: true }).nullable().optional(),
})

export type CreatePartnerInput = z.infer<typeof createPartnerSchema>
export type UpdatePartnerInput = z.infer<typeof updatePartnerSchema>
