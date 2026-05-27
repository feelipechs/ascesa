import { prisma } from '@/lib/prisma'

export async function getAreas() {
  return prisma.area.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      coverUrl: true,
      iconName: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { projects: true, members: true } },
    },
  })
}

export async function getAreaBySlug(slug: string) {
  return prisma.area.findUnique({
    where: { slug },
    include: {
      projects: true,
      members: { include: { teamMember: true } },
    },
  })
}

export async function getAreaById(id: string) {
  return prisma.area.findUnique({ where: { id } })
}

export async function createArea(data: {
  title: string
  slug: string
  description?: string
  coverUrl?: string
  iconName?: string | null
  publishedAt?: Date
}) {
  return prisma.area.create({ data })
}

export async function updateArea(
  id: string,
  data: {
    title?: string
    slug?: string
    description?: string
    coverUrl?: string
    iconName?: string | null
    publishedAt?: Date | null
  }
) {
  return prisma.area.update({ where: { id }, data })
}

export async function deleteArea(id: string) {
  return prisma.area.delete({ where: { id } })
}
