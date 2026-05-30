import { prisma } from '@/lib/prisma'

export async function getAnimalSpecies() {
  return prisma.animalSpecies.findMany({ orderBy: { order: 'asc' } })
}

export async function getAnimalSpeciesById(id: string) {
  return prisma.animalSpecies.findUnique({ where: { id } })
}

export async function createAnimalSpecies(data: { name: string; order?: number }) {
  return prisma.animalSpecies.create({ data })
}

export async function updateAnimalSpecies(id: string, data: { name?: string; order?: number }) {
  return prisma.animalSpecies.update({ where: { id }, data })
}

export async function deleteAnimalSpecies(id: string) {
  return prisma.animalSpecies.delete({ where: { id } })
}

export async function reorderAnimalSpecies(items: { id: string; order: number }[]) {
  return prisma.$transaction(
    items.map((item) =>
      prisma.animalSpecies.update({
        where: { id: item.id },
        data: { order: item.order },
      })
    )
  )
}
