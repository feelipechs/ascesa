import { prisma } from '@/lib/prisma'
import { cleanupOrphanedMedia } from '@/lib/media'
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
    include: { media: { select: { id: true, url: true } } },
  })
}

export async function getGalleryImageById(id: string) {
  return prisma.galleryImage.findUnique({ where: { id } })
}

export async function createGalleryImage(data: {
  mediaId: string
  caption?: string
  order?: number
  context: GalleryContext
  projectId?: string | null
  animalId?: string | null
}) {
  return prisma.galleryImage.create({
    data: {
      ...data,
      projectId: data.projectId ?? null,
      animalId: data.animalId ?? null,
    },
  })
}

export async function updateGalleryImage(
  id: string,
  data: {
    mediaId?: string
    caption?: string
    order?: number
    context?: GalleryContext
    projectId?: string | null
    animalId?: string | null
  }
) {
  return prisma.galleryImage.update({
    where: { id },
    data: {
      ...data,
      projectId: data.projectId ?? undefined,
      animalId: data.animalId ?? undefined,
    },
  })
}

export async function deleteGalleryImage(id: string) {
  const image = await prisma.galleryImage.findUnique({ where: { id }, include: { media: true } })
  const mediaId = image?.media?.id
  await prisma.galleryImage.delete({ where: { id } })
  if (mediaId) await cleanupOrphanedMedia(mediaId)
}

export async function reorderGalleryImages(items: { id: string; order: number }[]) {
  return prisma.$transaction(
    items.map((item) =>
      prisma.galleryImage.update({
        where: { id: item.id },
        data: { order: item.order },
      })
    )
  )
}
