import { z } from 'zod'

export const updateSiteSettingsSchema = z.object({
  email: z.string().email('Email inválido').optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  cnpj: z.string().optional(),
  mission: z.string().optional(),
  vision: z.string().optional(),
  about: z.string().optional(),
  values: z.string().optional(),
  socialInstagram: z.string().optional(),
  socialFacebook: z.string().optional(),
  socialYoutube: z.string().optional(),
  socialWhatsapp: z.string().optional(),
  socialLinkedin: z.string().optional(),
  googleMapsEmbedUrl: z.string().optional(),
})

export type UpdateSiteSettingsInput = z.infer<typeof updateSiteSettingsSchema>
