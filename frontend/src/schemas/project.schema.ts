import { z } from 'zod'

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Título obrigatório'),
  slug: z.string().min(1, 'Slug obrigatório'),
  description: z.string().optional(),
  content: z.string().optional(),
  coverUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  featured: z.boolean().default(false),
  publishedAt: z.string().optional(),
  eventDate: z.string().nullable().optional(),
  location: z.string().optional(),
  vacancies: z.number().int().nullable().optional(),
  metrics: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  areaId: z.string().min(1, 'Área obrigatória'),
})

export const updateProjectSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  coverUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  featured: z.boolean().optional(),
  publishedAt: z.string().nullable().optional(),
  eventDate: z.string().nullable().optional(),
  location: z.string().optional(),
  vacancies: z.number().int().nullable().optional(),
  metrics: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  areaId: z.string().optional(),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
