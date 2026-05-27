import { prisma } from '@/lib/prisma'

export async function getPartners() {
  return prisma.partner.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export async function getPartnerById(id: string) {
  return prisma.partner.findUnique({ where: { id } })
}

export async function createPartner(data: {
  name: string
  logoUrl: string
  websiteUrl?: string
  publishedAt?: Date
}) {
  return prisma.partner.create({ data })
}

export async function updatePartner(
  id: string,
  data: {
    name?: string
    logoUrl?: string
    websiteUrl?: string
    publishedAt?: Date | null
  }
) {
  return prisma.partner.update({ where: { id }, data })
}

export async function deletePartner(id: string) {
  return prisma.partner.delete({ where: { id } })
}
