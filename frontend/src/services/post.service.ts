import { prisma } from '@/lib/prisma'
import { toSlug } from '@/lib/utils'
import type { CreatePostInput, UpdatePostInput } from '@/schemas/post.schema'
import type { PostFilters, PaginatedResponse, Post } from '@/types'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 12

export const PostService = {
  async findAll() {
    return prisma.post.findMany({
      orderBy: { publishedAt: 'desc' },
    })
  },

  async findPublished(filters?: PostFilters): Promise<PaginatedResponse<Post>> {
    const page = filters?.page ?? DEFAULT_PAGE
    const limit = filters?.limit ?? DEFAULT_LIMIT
    const search = filters?.search

    const where = {
      publishedAt: { not: null },
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' as const } },
              { excerpt: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    }

    const [data, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.post.count({ where }),
    ])

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  },

  async findBySlug(slug: string) {
    return prisma.post.findUnique({
      where: { slug },
    })
  },

  async findById(id: string) {
    return prisma.post.findUnique({
      where: { id },
    })
  },

  async create(data: CreatePostInput) {
    const slug = data.slug || toSlug(data.title)
    return prisma.post.create({
      data: {
        ...data,
        slug,
      },
    })
  },

  async update(id: string, data: UpdatePostInput) {
    return prisma.post.update({
      where: { id },
      data,
    })
  },

  async delete(id: string) {
    return prisma.post.delete({
      where: { id },
    })
  },
}
