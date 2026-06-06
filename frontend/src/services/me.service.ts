import { prisma } from '@/lib/prisma'

const userSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const

export const MeService = {
  async getProfile(id: string) {
    return prisma.user.findUnique({ where: { id }, select: userSelect })
  },

  async updateProfile(id: string, data: Record<string, unknown>) {
    return prisma.user.update({ where: { id }, data, select: userSelect })
  },
}
