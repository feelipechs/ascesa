import { prisma } from '@/lib/prisma'

const memberInclude = {
  areas: { include: { area: { select: { id: true, title: true } } } },
} as const

export async function getTeamMembers() {
  return prisma.teamMember.findMany({
    include: memberInclude,
    orderBy: { order: 'asc' },
  })
}

export async function getTeamMemberById(id: string) {
  return prisma.teamMember.findUnique({
    where: { id },
    include: memberInclude,
  })
}

export async function createTeamMember(data: {
  name: string
  role: string
  bio?: string
  photoUrl?: string
  order?: number
  publishedAt?: Date
  areaIds: string[]
}) {
  const { areaIds, publishedAt, ...fields } = data
  return prisma.teamMember.create({
    data: {
      ...fields,
      publishedAt: publishedAt ? new Date(publishedAt) : undefined,
      areas: { create: areaIds.map((areaId) => ({ areaId })) },
    },
    include: memberInclude,
  })
}

export async function updateTeamMember(
  id: string,
  data: {
    name?: string
    role?: string
    bio?: string
    photoUrl?: string
    order?: number
    publishedAt?: Date | null
    areaIds?: string[]
  }
) {
  const { areaIds, publishedAt, ...fields } = data
  return prisma.teamMember.update({
    where: { id },
    data: {
      ...fields,
      publishedAt: publishedAt === null ? null : publishedAt ? new Date(publishedAt) : undefined,
      ...(areaIds && {
        areas: {
          deleteMany: {},
          create: areaIds.map((areaId) => ({ areaId })),
        },
      }),
    },
    include: memberInclude,
  })
}

export async function deleteTeamMember(id: string) {
  return prisma.teamMember.delete({ where: { id } })
}
