import { z } from 'zod'

export const createPartnerSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  logoMediaId: z.string().min(1, 'Logo obrigatório'),
  websiteUrl: z.string().url('URL do site inválida').optional().or(z.literal('')),
})

export const updatePartnerSchema = z.object({
  name: z.string().min(1).optional(),
  logoMediaId: z.string().min(1).optional(),
  websiteUrl: z.string().url('URL do site inválida').optional().or(z.literal('')),
})

export type CreatePartnerInput = z.infer<typeof createPartnerSchema>
export type UpdatePartnerInput = z.infer<typeof updatePartnerSchema>
