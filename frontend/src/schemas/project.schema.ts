import { z } from 'zod'
import { dateInputToISO } from '@/lib/utils-date'

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Título obrigatório').max(255, 'Máximo 255 caracteres'),
  slug: z.string().min(1, 'Slug obrigatório').regex(/^[a-z0-9-]+$/, 'Formato de slug inválido').max(100, 'Máximo 100 caracteres'),
  description: z.string().max(500, 'Máximo 500 caracteres').optional(),
  content: z.string().optional(),
  coverMediaId: z.string().optional().or(z.literal('')),
  featured: z.boolean().default(false),
  eventDate: z.preprocess(
    (v) => (typeof v === 'string' && v.trim() !== '' ? dateInputToISO(v) : null),
    z.string().datetime().nullable().optional(),
  ),
  location: z.string().max(255, 'Máximo 255 caracteres').optional(),
  vacancies: z.number().int().nullable().optional(),
  metrics: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  areaId: z.string().min(1, 'Área obrigatória'),
})

export const updateProjectSchema = createProjectSchema.partial()

export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
