import { z } from 'zod'

export const documentFiltersSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  year: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
})

export type DocumentFiltersInput = z.infer<typeof documentFiltersSchema>
