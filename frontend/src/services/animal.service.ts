// Diferente de posts e projetos, animais com publishedAt: null aparecem
// na listagem pública. Isso é intencional — todos os animais cadastrados
// devem estar visíveis para adoção. Se mudar esse comportamento no futuro,
// adicione: where: { publishedAt: { not: null } } no findAll.

import { prisma } from '@/lib/prisma'
import type { Prisma } from '@/generated/prisma/client'
import type { AnimalGender, AnimalStatus } from '@/generated/prisma/enums'

type AnimalWithIncludes = Prisma.AnimalGetPayload<{
  include: {
    species: { select: { id: true; name: true } }
    size: { select: { id: true; label: true } }
    ageRange: { select: { id: true; label: true } }
    gallery: { orderBy: { order: 'asc' }; select: { id: true; url: true; caption: true; order: true } }
  }
}>

type AnimalFilters = {
  speciesId?: string
  sizeId?: string
  ageRangeId?: string
  gender?: AnimalGender
  status?: AnimalStatus
  search?: string
  featured?: boolean
  page?: number
  limit?: number
}

type AnimalListItem = {
  id: string
  name: string
  slug: string
  coverUrl: string | null
  description: string | null
  status: AnimalStatus
  featured: boolean
  gender: AnimalGender
  breed: string | null
  shelterSince: Date
  species: { id: string; name: string }
  size: { id: string; label: string } | null
  ageRange: { id: string; label: string } | null
}

type PaginatedResult<T> = {
  data: T[]
  meta: { total: number; page: number; limit: number; totalPages: number }
}

const DEFAULT_LIMIT = 12

export const AnimalService = {
  async findAll(filters: AnimalFilters = {}): Promise<PaginatedResult<AnimalListItem>> {
    const page = filters.page ?? 1
    const limit = filters.limit ?? DEFAULT_LIMIT
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (filters.speciesId) where.speciesId = filters.speciesId
    if (filters.sizeId) where.sizeId = filters.sizeId
    if (filters.ageRangeId) where.ageRangeId = filters.ageRangeId
    if (filters.gender) where.gender = filters.gender
    if (filters.status) where.status = filters.status
    if (filters.featured) where.featured = true
    if (filters.search) {
      where.OR = [{ name: { contains: filters.search, mode: 'insensitive' as const } }]
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
          coverUrl: true,
          description: true,
          status: true,
          featured: true,
          gender: true,
          breed: true,
          shelterSince: true,
          species: { select: { id: true, name: true } },
          size: { select: { id: true, label: true } },
          ageRange: { select: { id: true, label: true } },
        },
      }),
      prisma.animal.count({ where }),
    ])

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    }
  },

  async findBySlug(slug: string): Promise<AnimalWithIncludes | null> {
    return prisma.animal.findUnique({
      where: { slug },
      include: {
        species: { select: { id: true, name: true } },
        size: { select: { id: true, label: true } },
        ageRange: { select: { id: true, label: true } },
        gallery: { orderBy: { order: 'asc' }, select: { id: true, url: true, caption: true, order: true } },
      },
    }) as Promise<AnimalWithIncludes | null>
  },

  async findById(id: string) {
    return prisma.animal.findUnique({
      where: { id },
      include: {
        species: { select: { id: true, name: true } },
        size: { select: { id: true, label: true } },
        ageRange: { select: { id: true, label: true } },
        gallery: { orderBy: { order: 'asc' } },
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
    return prisma.animal.delete({ where: { id } })
  },
}

export type { AnimalWithIncludes, AnimalFilters, AnimalListItem, PaginatedResult }
