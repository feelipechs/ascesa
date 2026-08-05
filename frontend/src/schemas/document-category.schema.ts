import { z } from 'zod'

export const createDocumentCategorySchema = z.object({
  name: z.string().min(1, 'Nome obrigatório').max(255, 'Máximo 255 caracteres'),
  slug: z.string().min(1, 'Slug obrigatório').regex(/^[a-z0-9-]+$/, 'Formato de slug inválido').max(100, 'Máximo 100 caracteres'),
})

export const updateDocumentCategorySchema = createDocumentCategorySchema.partial()

export type CreateDocumentCategoryInput = z.infer<typeof createDocumentCategorySchema>
export type UpdateDocumentCategoryInput = z.infer<typeof updateDocumentCategorySchema>
