import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/password'

const userSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const

export const UserService = {
  async findAll() {
    return prisma.user.findMany({ select: userSelect, orderBy: { createdAt: 'desc' } })
  },

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id }, select: userSelect })
  },

  async create(data: { email: string; password: string; name?: string; role?: string }) {
    const hashedPassword = await hashPassword(data.password)
    return prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        role: (data.role as 'ADMIN' | 'STAFF') ?? 'STAFF',
        accounts: {
          create: {
            providerId: 'credential',
            accountId: '',
            password: hashedPassword,
          },
        },
      },
      select: userSelect,
    })
  },

  async update(id: string, data: Record<string, unknown>) {
    return prisma.user.update({ where: { id }, data, select: userSelect })
  },

  async delete(id: string) {
    return prisma.user.delete({ where: { id } })
  },

  async findAccount(userId: string) {
    return prisma.account.findFirst({
      where: { userId, providerId: 'credential' },
    })
  },

  async findAdminCount(excludeId?: string) {
    return prisma.user.count({
      where: { role: 'ADMIN', id: excludeId ? { not: excludeId } : undefined },
    })
  },

  async updateAccountPassword(accountId: string, hashedPassword: string) {
    return prisma.account.update({
      where: { id: accountId },
      data: { password: hashedPassword },
    })
  },
}
