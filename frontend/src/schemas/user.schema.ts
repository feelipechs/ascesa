import { z } from 'zod'
import { Role } from '@/generated/prisma/enums'

export const createUserSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  name: z.string().optional(),
  role: z.nativeEnum(Role).optional(),
})

export const updateUserSchema = z.object({
  email: z.string().email('Email inválido').optional(),
  name: z.string().optional(),
  role: z.nativeEnum(Role).optional(),
  password: z.string().min(6, 'Mínimo 6 caracteres').optional(),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
