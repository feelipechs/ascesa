import { z } from 'zod'

export const createDocumentSchema = z.object({
  title: z.string().min(1, 'Título obrigatório').max(255, 'Máximo 255 caracteres'),
  description: z.string().max(500, 'Máximo 500 caracteres').optional(),
  fileUrl: z.string().url('URL do arquivo inválida'),
  year: z.coerce.number().int().optional(),
  categoryId: z.string().min(1, 'Categoria obrigatória'),
})

export const updateDocumentSchema = createDocumentSchema.partial()

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>
