import { prisma } from '@/lib/prisma'
import { calculatePaginationMeta } from '@/lib/pagination'
import type { CreateFiscalNoteInput } from '@/schemas/fiscal-note.schema'

const DEFAULT_LIMIT = 12

export const FiscalNoteService = {
  async findAll(filters?: { page?: number; limit?: number }) {
    const page = filters?.page ?? 1
    const limit = filters?.limit ?? DEFAULT_LIMIT
    const skip = (page - 1) * limit

    const [data, total] = await Promise.all([
      prisma.fiscalNote.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.fiscalNote.count(),
    ])

    return { data, meta: calculatePaginationMeta(total, page, limit) }
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
