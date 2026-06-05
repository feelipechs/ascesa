import { prisma } from '@/lib/prisma'
import type { CreateFiscalNoteInput } from '@/schemas/fiscal-note.schema'

export const FiscalNoteService = {
  async findAll() {
    return prisma.fiscalNote.findMany({
      orderBy: { createdAt: 'desc' },
    })
  },

  async findById(id: string) {
    return prisma.fiscalNote.findUnique({ where: { id } })
  },

  async create(data: CreateFiscalNoteInput) {
    if (data.type === 'DETAILED') {
      return prisma.fiscalNote.create({
        data: {
          type: data.type,
          cnpj: data.cnpj,
          emissionDate: data.emissionDate ? new Date(data.emissionDate) : undefined,
          coo: data.coo,
          amount: data.amount,
        },
      })
    }
    return prisma.fiscalNote.create({
      data: {
        type: data.type,
        accessKey: data.accessKey,
      },
    })
  },

  async delete(id: string) {
    return prisma.fiscalNote.delete({ where: { id } })
  },
}
