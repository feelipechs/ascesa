import { z } from 'zod'

export const createPartnerSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  logoUrl: z.string().min(1, 'URL do logo obrigatória'),
  websiteUrl: z.string().optional(),
  publishedAt: z.string().datetime({ offset: true }).optional(),
})

export const updatePartnerSchema = z.object({
  name: z.string().min(1).optional(),
  logoUrl: z.string().min(1).optional(),
  websiteUrl: z.string().optional(),
  publishedAt: z.string().datetime({ offset: true }).nullable().optional(),
})

export type CreatePartnerInput = z.infer<typeof createPartnerSchema>
export type UpdatePartnerInput = z.infer<typeof updatePartnerSchema>
