import { prisma } from '@/lib/prisma'

export const FiscalNoteService = {
  async findAll() {
    return prisma.fiscalNote.findMany({ orderBy: { createdAt: 'desc' } })
  },

  async findById(id: string) {
    return prisma.fiscalNote.findUnique({ where: { id } })
  },

  async create(data: Record<string, unknown>) {
    return prisma.fiscalNote.create({ data: data as never })
  },

  async update(id: string, data: Record<string, unknown>) {
    return prisma.fiscalNote.update({ where: { id }, data: data as never })
  },

  async delete(id: string) {
    return prisma.fiscalNote.delete({ where: { id } })
  },
}
