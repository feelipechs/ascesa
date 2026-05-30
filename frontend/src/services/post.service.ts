import { prisma } from '@/lib/prisma'
import { toSlug } from '@/lib/utils'
import type { CreatePostInput, UpdatePostInput } from '@/schemas/post.schema'

export const PostService = {
  async findAll() {
    return prisma.post.findMany({ orderBy: { publishedAt: 'desc' } })
  },

  async findPublished(search?: string) {
    return prisma.post.findMany({
      where: {
        publishedAt: { not: null },
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' as const } },
                { excerpt: { contains: search, mode: 'insensitive' as const } },
              ],
            }
          : {}),
      },
      orderBy: { publishedAt: 'desc' },
    })
  },

  async findBySlug(slug: string) {
    return prisma.post.findUnique({ where: { slug } })
  },

  async findById(id: string) {
    return prisma.post.findUnique({ where: { id } })
  },

  async create(data: CreatePostInput) {
    const slug = data.slug || toSlug(data.title)
    return prisma.post.create({ data: { ...data, slug } })
  },

  async update(id: string, data: UpdatePostInput) {
    return prisma.post.update({ where: { id }, data })
  },

  async delete(id: string) {
    return prisma.post.delete({ where: { id } })
  },
}
