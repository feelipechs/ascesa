import { prisma } from '@/lib/prisma'
import type { Prisma } from '@/generated/prisma/client'

export async function getProjects(params?: {
  search?: string
  areas?: string[]
  featured?: boolean
  page?: number
  limit?: number
}) {
  const { search = '', areas = [], featured, page = 1, limit = 8 } = params ?? {}
  const matchedIds = search
    ? (
        await prisma.$queryRaw<{ id: string }[]>`
        SELECT id FROM "Project"
        WHERE unaccent(title) ILIKE unaccent(${'%' + search + '%'})
        OR unaccent(description) ILIKE unaccent(${'%' + search + '%'})
      `
      ).map((r) => r.id)
    : null

  const where = {
    ...(matchedIds && { id: { in: matchedIds } }),
    ...(areas.length > 0 && { area: { slug: { in: areas } } }),
    ...(featured !== undefined && { featured }),
  }

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      include: { area: true, gallery: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.project.count({ where }),
  ])

  return {
    data: projects,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  }
}

export async function getProjectBySlug(slug: string) {
  return prisma.project.findUnique({
    where: { slug },
    include: { area: true, gallery: true },
  })
}

export async function getProjectById(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: { area: true },
  })
}

export async function createProject(data: Prisma.ProjectCreateInput) {
  return prisma.project.create({ data, include: { area: true } })
}

export async function updateProject(id: string, data: Prisma.ProjectUpdateInput) {
  return prisma.project.update({ where: { id }, data })
}

export async function deleteProject(id: string) {
  return prisma.project.delete({ where: { id } })
}

export async function getProjectsWithVolunteers() {
  return prisma.project.findMany({
    where: { eventDate: { not: null } },
    orderBy: { eventDate: 'desc' },
    include: {
      registrations: {
        include: {
          volunteer: { select: { id: true, name: true, email: true, phone: true } },
        },
      },
    },
  })
}
