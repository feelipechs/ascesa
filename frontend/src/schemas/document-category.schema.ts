import { z } from 'zod'

export const createDocumentCategorySchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  slug: z.string().min(1, 'Slug obrigatório'),
})

export const updateDocumentCategorySchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
})

export type CreateDocumentCategoryInput = z.infer<typeof createDocumentCategorySchema>
export type UpdateDocumentCategoryInput = z.infer<typeof updateDocumentCategorySchema>
