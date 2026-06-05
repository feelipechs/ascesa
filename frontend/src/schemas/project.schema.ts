import { z } from 'zod'
import { dateInputToISO } from '@/lib/utils-date'

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Título obrigatório'),
  slug: z.string().min(1, 'Slug obrigatório'),
  description: z.string().optional(),
  content: z.string().optional(),
  coverMediaId: z.string().optional().or(z.literal('')),
  featured: z.boolean().default(false),
  eventDate: z.preprocess(
    (v) => (typeof v === 'string' && v.trim() !== '' ? dateInputToISO(v) : null),
    z.string().datetime().nullable().optional(),
  ),
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
  coverMediaId: z.string().nullable().optional(),
  featured: z.boolean().optional(),
  eventDate: z.preprocess(
    (v) => (typeof v === 'string' && v.trim() !== '' ? dateInputToISO(v) : null),
    z.string().datetime().nullable().optional(),
  ),
  location: z.string().optional(),
  vacancies: z.number().int().nullable().optional(),
  metrics: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  areaId: z.string().optional(),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
