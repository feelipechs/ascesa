import { z } from 'zod'

export const updateSiteSettingsSchema = z.object({
  email: z.string().email('Email inválido').max(255, 'Máximo 255 caracteres').optional(),
  phone: z.string().max(20, 'Telefone inválido').optional(),
  address: z.string().max(255, 'Máximo 255 caracteres').optional(),
  cnpj: z.string().max(18, 'CNPJ inválido').optional(),
  mission: z.string().max(5000, 'Máximo 5000 caracteres').optional(),
  vision: z.string().max(5000, 'Máximo 5000 caracteres').optional(),
  about: z.string().max(5000, 'Máximo 5000 caracteres').optional(),
  values: z.string().max(5000, 'Máximo 5000 caracteres').optional(),
  socialInstagram: z.string().max(255, 'Máximo 255 caracteres').optional(),
  socialFacebook: z.string().max(255, 'Máximo 255 caracteres').optional(),
  socialYoutube: z.string().max(255, 'Máximo 255 caracteres').optional(),
  socialWhatsapp: z.string().max(20, 'Telefone inválido').optional(),
  socialLinkedin: z.string().max(255, 'Máximo 255 caracteres').optional(),
  googleMapsEmbedUrl: z.string().url('URL inválida').optional(),
})

export type UpdateSiteSettingsInput = z.infer<typeof updateSiteSettingsSchema>
