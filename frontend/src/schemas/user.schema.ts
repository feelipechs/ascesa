import { z } from 'zod'
import { Role } from '@/generated/prisma/enums'

export const createUserSchema = z.object({
  email: z.string().email('Email inválido').max(255, 'Máximo 255 caracteres'),
  password: z.string().min(6, 'Mínimo 6 caracteres').max(128, 'Máximo 128 caracteres'),
  name: z.string().max(255, 'Máximo 255 caracteres').optional(),
  role: z.nativeEnum(Role).optional(),
})

export const updateUserSchema = z.object({
  email: z.string().email('Email inválido').max(255, 'Máximo 255 caracteres').optional(),
  name: z.string().max(255, 'Máximo 255 caracteres').optional(),
  role: z.nativeEnum(Role).optional(),
  password: z.string().min(6, 'Mínimo 6 caracteres').max(128, 'Máximo 128 caracteres').optional(),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
