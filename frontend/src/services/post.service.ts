import { prisma } from '@/lib/prisma'
import type { CreatePostInput, UpdatePostInput } from '@/schemas/post.schema'

export const PostService = {
  async findAll() {
    return prisma.post.findMany({ orderBy: { publishedAt: 'desc' } })
  },

  async findPublished() {
    return prisma.post.findMany({
      where: { publishedAt: { not: null } },
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
    const slug = data.slug || data.title.toLowerCase().replace(/\s+/g, '-')
    return prisma.post.create({ data: { ...data, slug } })
  },

  async update(id: string, data: UpdatePostInput) {
    return prisma.post.update({ where: { id }, data })
  },

  async delete(id: string) {
    return prisma.post.delete({ where: { id } })
  },
}
