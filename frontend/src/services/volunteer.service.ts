import { prisma } from '@/lib/prisma'
import { calculatePaginationMeta } from '@/lib/pagination'
import type { CreateVolunteerInput, UpdateVolunteerInput } from '@/schemas/volunteer.schema'

const DEFAULT_LIMIT = 12

export const VolunteerService = {
  async findAll(filters?: { search?: string; page?: number; limit?: number }) {
    const page = filters?.page ?? 1
    const limit = filters?.limit ?? DEFAULT_LIMIT
    const skip = (page - 1) * limit

    const where = filters?.search
      ? {
          OR: [
            { name: { contains: filters.search, mode: 'insensitive' as const } },
            { email: { contains: filters.search, mode: 'insensitive' as const } },
          ],
        }
      : undefined

    const [data, total] = await Promise.all([
      prisma.volunteer.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.volunteer.count({ where }),
    ])

    return { data, meta: calculatePaginationMeta(total, page, limit) }
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
