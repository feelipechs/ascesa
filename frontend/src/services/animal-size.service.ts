import { prisma } from '@/lib/prisma'

export async function getAnimalSizes() {
  return prisma.animalSize.findMany({ orderBy: { order: 'asc' } })
}

export async function getAnimalSizeById(id: string) {
  return prisma.animalSize.findUnique({ where: { id } })
}

export async function createAnimalSize(data: { label: string; description?: string | null; order?: number }) {
  return prisma.animalSize.create({ data })
}

export async function updateAnimalSize(id: string, data: { label?: string; description?: string | null; order?: number }) {
  return prisma.animalSize.update({ where: { id }, data })
}

export async function deleteAnimalSize(id: string) {
  return prisma.animalSize.delete({ where: { id } })
}
