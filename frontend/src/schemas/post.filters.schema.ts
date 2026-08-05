import { z } from 'zod'
import { zodBoolean } from '@/schemas/helpers'

export const postFiltersSchema = z.object({
  search: z.string().optional(),
  includeDrafts: zodBoolean.optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
})

export type PostFiltersInput = z.infer<typeof postFiltersSchema>
