import { prisma } from '@/lib/prisma'

export async function getSettings() {
  let settings = await prisma.siteSettings.findUnique({ where: { id: 'main' } })
  if (!settings) {
    settings = await prisma.siteSettings.create({ data: { id: 'main' } })
  }
  return settings
}

export async function upsertSettings(data: Record<string, unknown>) {
  return prisma.siteSettings.upsert({
    where: { id: 'main' },
    create: { id: 'main', ...data },
    update: data,
  })
}
