import { prisma } from '@/lib/prisma'

export async function getDocumentCategories() {
  return prisma.documentCategory.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { documents: true } } },
  })
}

export async function getDocumentCategoryById(id: string) {
  return prisma.documentCategory.findUnique({ where: { id } })
}

export async function createDocumentCategory(data: {
  name: string
  slug: string
}) {
  return prisma.documentCategory.create({ data })
}

export async function updateDocumentCategory(id: string, data: { name?: string; slug?: string }) {
  return prisma.documentCategory.update({ where: { id }, data })
}

export async function deleteDocumentCategory(id: string) {
  return prisma.documentCategory.delete({ where: { id } })
}
