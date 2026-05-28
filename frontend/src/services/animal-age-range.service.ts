import { prisma } from '@/lib/prisma'

export async function getAnimalAgeRanges() {
  return prisma.animalAgeRange.findMany({ orderBy: { order: 'asc' } })
}

export async function getAnimalAgeRangeById(id: string) {
  return prisma.animalAgeRange.findUnique({ where: { id } })
}

export async function createAnimalAgeRange(data: { label: string; minAge?: number | null; maxAge?: number | null; order?: number }) {
  return prisma.animalAgeRange.create({ data })
}

export async function updateAnimalAgeRange(id: string, data: { label?: string; minAge?: number | null; maxAge?: number | null; order?: number }) {
  return prisma.animalAgeRange.update({ where: { id }, data })
}

export async function deleteAnimalAgeRange(id: string) {
  return prisma.animalAgeRange.delete({ where: { id } })
}
