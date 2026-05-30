import { prisma } from '@/lib/prisma'
import { GalleryContext } from '@/generated/prisma/enums'

export async function getGalleryImages(params?: {
  context?: string
  projectId?: string
  animalId?: string
}) {
  const { context, projectId, animalId } = params ?? {}

  const where: Record<string, unknown> = {}
  if (context && (context === GalleryContext.HOME || context === GalleryContext.PROJECT || context === GalleryContext.ANIMAL)) {
    where.context = context
  }
  if (projectId) {
    where.projectId = projectId
  }
  if (animalId) {
    where.animalId = animalId
  }

  return prisma.galleryImage.findMany({
    where,
    orderBy: { order: 'asc' },
  })
}

export async function getGalleryImageById(id: string) {
  return prisma.galleryImage.findUnique({ where: { id } })
}

export async function createGalleryImage(data: {
  url: string
  caption?: string
  order?: number
  context: GalleryContext
  projectId?: string | null
}) {
  return prisma.galleryImage.create({
    data: { ...data, projectId: data.projectId ?? null },
  })
}

export async function updateGalleryImage(
  id: string,
  data: {
    url?: string
    caption?: string
    order?: number
    context?: GalleryContext
    projectId?: string | null
  }
) {
  return prisma.galleryImage.update({
    where: { id },
    data: { ...data, projectId: data.projectId ?? undefined },
  })
}

export async function deleteGalleryImage(id: string) {
  return prisma.galleryImage.delete({ where: { id } })
}
