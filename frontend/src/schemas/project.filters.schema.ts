import { z } from 'zod'
import { zodBoolean } from '@/schemas/helpers'

export const projectFiltersSchema = z.object({
  search: z.string().optional(),
  areas: z.string().optional(),
  featured: zodBoolean.optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
})

export type ProjectFiltersInput = z.infer<typeof projectFiltersSchema>
