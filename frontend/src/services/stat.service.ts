import { prisma } from '@/lib/prisma'
import type { CreateStatInput, UpdateStatInput } from '@/schemas/stat.schema'

export const StatService = {
  async findAll() {
    return prisma.stat.findMany({ orderBy: { order: 'asc' } })
  },

  async findById(id: string) {
    return prisma.stat.findUnique({ where: { id } })
  },

  async create(data: CreateStatInput) {
    const maxOrder = await prisma.stat.aggregate({ _max: { order: true } })
    const order = (maxOrder._max.order ?? -1) + 1
    return prisma.stat.create({ data: { ...data, order } })
  },

  async update(id: string, data: UpdateStatInput) {
    return prisma.stat.update({ where: { id }, data })
  },

  async delete(id: string) {
    return prisma.stat.delete({ where: { id } })
  },

  async reorder(items: { id: string; order: number }[]) {
    return prisma.$transaction(
      items.map((item) =>
        prisma.stat.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    )
  },
}
