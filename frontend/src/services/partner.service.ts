import { prisma } from '@/lib/prisma'
import { cleanupOrphanedMedia } from '@/lib/media'

export async function getPartners() {
  return prisma.partner.findMany({
    orderBy: { createdAt: 'desc' },
    include: { logoMedia: { select: { id: true, url: true } } },
  })
}

export async function getPartnerById(id: string) {
  return prisma.partner.findUnique({
    where: { id },
    include: { logoMedia: { select: { id: true, url: true } } },
  })
}

export async function createPartner(data: {
  name: string
  logoMediaId: string
  websiteUrl?: string
}) {
  return prisma.partner.create({ data, include: { logoMedia: { select: { id: true, url: true } } } })
}

export async function updatePartner(
  id: string,
  data: {
    name?: string
    logoMediaId?: string
    websiteUrl?: string
  }
) {
  return prisma.partner.update({ where: { id }, data, include: { logoMedia: { select: { id: true, url: true } } } })
}

export async function deletePartner(id: string) {
  const partner = await prisma.partner.findUnique({ where: { id }, include: { logoMedia: true } })
  const logoMediaId = partner?.logoMedia?.id
  await prisma.partner.delete({ where: { id } })
  if (logoMediaId) await cleanupOrphanedMedia(logoMediaId)
}
