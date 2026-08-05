import { z } from 'zod'

export const createPartnerSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório').max(255, 'Máximo 255 caracteres'),
  logoMediaId: z.string().min(1, 'Logo obrigatório'),
  websiteUrl: z.string().url('URL do site inválida').optional().or(z.literal('')),
})

export const updatePartnerSchema = createPartnerSchema.partial()

export type CreatePartnerInput = z.infer<typeof createPartnerSchema>
export type UpdatePartnerInput = z.infer<typeof updatePartnerSchema>
