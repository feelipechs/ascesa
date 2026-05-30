import { prisma } from '@/lib/prisma'
import type { CreateVolunteerInput, UpdateVolunteerInput } from '@/schemas/volunteer.schema'

export const VolunteerService = {
  async findAll(search?: string) {
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : undefined
    return prisma.volunteer.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })
  },

  async findById(id: string) {
    return prisma.volunteer.findUnique({
      where: { id },
      include: { registrations: { include: { project: { select: { id: true, title: true, slug: true } } } } },
    })
  },

  async upsertByEmail(data: CreateVolunteerInput) {
    return prisma.volunteer.upsert({
      where: { email: data.email },
      update: { name: data.name, phone: data.phone ?? undefined },
      create: data,
    })
  },

  async create(data: CreateVolunteerInput) {
    return prisma.volunteer.create({ data })
  },

  async update(id: string, data: UpdateVolunteerInput) {
    return prisma.volunteer.update({ where: { id }, data })
  },

  async delete(id: string) {
    return prisma.volunteer.delete({ where: { id } })
  },
}
