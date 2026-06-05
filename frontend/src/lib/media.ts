import { prisma } from '@/lib/prisma'
import { deleteFromR2 } from '@/lib/r2'

export async function cleanupOrphanedMedia(mediaId: string): Promise<void> {
  const media = await prisma.media.findUnique({
    where: { id: mediaId },
    include: {
      areaCovers: { select: { id: true } },
      projectCovers: { select: { id: true } },
      postCovers: { select: { id: true } },
      animalCovers: { select: { id: true } },
      teamMemberPhotos: { select: { id: true } },
      partnerLogos: { select: { id: true } },
      galleryImages: { select: { id: true } },
    },
  })

  if (!media) return

  const hasReferences =
    media.areaCovers.length > 0 ||
    media.projectCovers.length > 0 ||
    media.postCovers.length > 0 ||
    media.animalCovers.length > 0 ||
    media.teamMemberPhotos.length > 0 ||
    media.partnerLogos.length > 0 ||
    media.galleryImages.length > 0

  if (!hasReferences) {
    await deleteFromR2(media.url)
    await prisma.media.delete({ where: { id: mediaId } })
  }
}
