import { prisma } from '@/lib/prisma'
import { cleanupOrphanedMedia } from '@/lib/media'

const memberInclude = {
  areas: { include: { area: { select: { id: true, title: true } } } },
  photoMedia: { select: { id: true, url: true } },
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
  photoMediaId?: string
  areaIds: string[]
}) {
  const { areaIds, ...fields } = data
  const maxOrder = await prisma.teamMember.aggregate({ _max: { order: true } })
  const order = (maxOrder._max.order ?? -1) + 1
  return prisma.teamMember.create({
    data: {
      ...fields,
      order,
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
    photoMediaId?: string | null
    order?: number
    areaIds?: string[]
  }
) {
  const { areaIds, ...fields } = data
  return prisma.teamMember.update({
    where: { id },
    data: {
      ...fields,
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
  const member = await prisma.teamMember.findUnique({ where: { id }, include: { photoMedia: true } })
  const photoMediaId = member?.photoMedia?.id
  await prisma.teamMember.delete({ where: { id } })
  if (photoMediaId) await cleanupOrphanedMedia(photoMediaId)
}

export async function reorderTeamMembers(items: { id: string; order: number }[]) {
  return prisma.$transaction(
    items.map((item) =>
      prisma.teamMember.update({
        where: { id: item.id },
        data: { order: item.order },
      })
    )
  )
}
