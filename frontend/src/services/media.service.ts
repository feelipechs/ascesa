import { prisma } from '@/lib/prisma'

export const MediaService = {
  async upsert(key: string, data: {
    hash: string
    url: string
    mimeType: string
    size: number
    originalName: string
    width: number | null
    height: number | null
  }) {
    return prisma.media.upsert({
      where: { key },
      create: { key, ...data },
      update: {},
    })
  },
}
