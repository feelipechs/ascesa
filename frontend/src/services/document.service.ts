import { prisma } from '@/lib/prisma'

export async function getDocuments(params?: {
  search?: string
  categoryId?: string
  year?: number
  page?: number
  limit?: number
}) {
  const { search = '', categoryId = '', year, page = 1, limit = 10 } = params ?? {}

  const where = {
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
    ...(categoryId && { categoryId }),
    ...(year && { year }),
  }

  const [documents, total] = await Promise.all([
    prisma.document.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.document.count({ where }),
  ])

  return {
    data: documents,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  }
}

export async function getDocumentById(id: string) {
  return prisma.document.findUnique({ where: { id }, include: { category: true } })
}

export async function createDocument(data: {
  title: string
  description?: string
  fileUrl: string
  year?: number
  categoryId: string
  publishedAt?: Date
}) {
  return prisma.document.create({
    data,
    include: { category: true },
  })
}

export async function updateDocument(
  id: string,
  data: {
    title?: string
    description?: string
    fileUrl?: string
    year?: number
    categoryId?: string
    publishedAt?: Date | null
  }
) {
  return prisma.document.update({
    where: { id },
    data,
    include: { category: true },
  })
}

export async function deleteDocument(id: string) {
  return prisma.document.delete({ where: { id } })
}
