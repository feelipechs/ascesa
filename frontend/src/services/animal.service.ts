import { prisma } from '@/lib/prisma'
import { cleanupOrphanedMedia } from '@/lib/media'
import type { Prisma } from '@/generated/prisma/client'
import { AnimalSpecies, AnimalSize, AnimalAgeRange, AnimalGender, AnimalStatus } from '@/generated/prisma/enums'
import type { AnimalListItem, AnimalWithDetails, AnimalFilters, PaginatedResponse } from '@/types'

const DEFAULT_LIMIT = 12

export const AnimalService = {
  async findAll(filters: AnimalFilters = {}): Promise<PaginatedResponse<AnimalListItem>> {
    const page = filters.page ?? 1
    const limit = filters.limit ?? DEFAULT_LIMIT
    const skip = (page - 1) * limit

    const where: Prisma.AnimalWhereInput = {}
    if (filters.species) where.species = filters.species as AnimalSpecies
    if (filters.size) where.size = filters.size as AnimalSize
    if (filters.ageRange) where.ageRange = filters.ageRange as AnimalAgeRange
    if (filters.gender) where.gender = filters.gender as AnimalGender
    if (filters.status) where.status = filters.status as AnimalStatus
    if (filters.featured) where.featured = true
    if (filters.search) {
      where.OR = [{ name: { contains: filters.search, mode: 'insensitive' } }]
    }

    const [data, total] = await Promise.all([
      prisma.animal.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
        select: {
          id: true,
          name: true,
          slug: true,
          coverMedia: { select: { id: true, url: true } },
          description: true,
          status: true,
          featured: true,
          gender: true,
          breed: true,
          shelterSince: true,
          species: true,
          size: true,
          ageRange: true,
        },
      }),
      prisma.animal.count({ where }),
    ])

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    }
  },

  async findBySlug(slug: string): Promise<AnimalWithDetails | null> {
    return prisma.animal.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        species: true,
        breed: true,
        gender: true,
        size: true,
        birthDate: true,
        ageRange: true,
        shelterSince: true,
        description: true,
        content: true,
        coverMedia: { select: { id: true, url: true } },
        status: true,
        featured: true,
        createdAt: true,
        updatedAt: true,
        gallery: { orderBy: { order: 'asc' }, select: { id: true, media: { select: { id: true, url: true } }, caption: true, order: true } },
      },
    }) as Promise<AnimalWithDetails | null>
  },

  async findById(id: string) {
    return prisma.animal.findUnique({
      where: { id },
      include: {
        coverMedia: true,
        gallery: { orderBy: { order: 'asc' }, include: { media: true } },
      },
    })
  },

  async create(data: Prisma.AnimalCreateInput) {
    return prisma.animal.create({ data })
  },

  async update(id: string, data: Prisma.AnimalUpdateInput) {
    return prisma.animal.update({ where: { id }, data })
  },

  async delete(id: string) {
    const animal = await prisma.animal.findUnique({
      where: { id },
      include: {
        coverMedia: true,
        gallery: { include: { media: true } },
      },
    })
    if (animal) {
      const mediaIds = [
        animal.coverMedia?.id,
        ...animal.gallery.map((g) => g.media.id),
      ].filter((id): id is string => !!id)

      await prisma.animal.delete({ where: { id } })

      for (const mediaId of mediaIds) {
        await cleanupOrphanedMedia(mediaId)
      }
    } else {
      await prisma.animal.delete({ where: { id } })
    }
  },
}
