import { prisma } from '@/lib/prisma'
import { cleanupOrphanedMedia } from '@/lib/media'

export async function getAreas() {
  return prisma.area.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      coverMedia: { select: { id: true, url: true } },
      iconName: true,
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
      coverMedia: { select: { id: true, url: true } },
      projects: {
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          featured: true,
          eventDate: true,
          location: true,
          vacancies: true,
          createdAt: true,
          updatedAt: true,
          areaId: true,
          coverMedia: { select: { id: true, url: true } },
          area: { select: { id: true, title: true, slug: true } },
        },
      },
      members: {
        include: {
          teamMember: {
            include: {
              photoMedia: { select: { id: true, url: true } },
              areas: { include: { area: { select: { id: true, title: true } } } },
            },
          },
        },
      },
    },
  })
}

export async function getAreaById(id: string) {
  return prisma.area.findUnique({
    where: { id },
    include: { coverMedia: { select: { id: true, url: true } } },
  })
}

export async function createArea(data: {
  title: string
  slug: string
  description?: string
  coverMediaId?: string
  iconName?: string | null
}) {
  return prisma.area.create({ data })
}

export async function updateArea(
  id: string,
  data: {
    title?: string
    slug?: string
    description?: string
    coverMediaId?: string | null
    iconName?: string | null
  }
) {
  return prisma.area.update({ where: { id }, data })
}

export async function deleteArea(id: string) {
  const area = await prisma.area.findUnique({ where: { id }, include: { coverMedia: true } })
  const coverMediaId = area?.coverMedia?.id
  await prisma.area.delete({ where: { id } })
  if (coverMediaId) await cleanupOrphanedMedia(coverMediaId)
}

export async function getAreaSlugs() {
  return prisma.area.findMany({
    select: { title: true, slug: true },
    orderBy: { title: 'asc' },
  })
}
