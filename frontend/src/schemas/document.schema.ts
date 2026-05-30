import { z } from 'zod'

export const createDocumentSchema = z.object({
  title: z.string().min(1, 'Título obrigatório'),
  description: z.string().optional(),
  fileUrl: z.string().url('URL do arquivo inválida'),
  year: z.coerce.number().int().optional(),
  publishedAt: z.string().datetime({ offset: true }).optional(),
  categoryId: z.string().min(1, 'Categoria obrigatória'),
})

export const updateDocumentSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  fileUrl: z.string().url('URL do arquivo inválida').optional().or(z.literal('')),
  year: z.coerce.number().int().optional(),
  publishedAt: z.string().datetime({ offset: true }).nullable().optional(),
  categoryId: z.string().optional(),
})

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>
