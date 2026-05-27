import { prisma } from '@/lib/prisma'

export async function getTestimonials(params?: { projectId?: string }) {
  const { projectId = '' } = params ?? {}

  const where = {
    ...(projectId && { projectId }),
  }

  return prisma.testimonial.findMany({
    where,
    include: { project: { select: { title: true } } },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getTestimonialById(id: string) {
  return prisma.testimonial.findUnique({
    where: { id },
    include: { project: { select: { title: true } } },
  })
}

export async function createTestimonial(data: {
  name: string
  role?: string
  message: string
  projectId: string
}) {
  return prisma.testimonial.create({ data })
}

export async function updateTestimonial(
  id: string,
  data: {
    name?: string
    role?: string
    message?: string
    projectId?: string
  }
) {
  return prisma.testimonial.update({ where: { id }, data })
}

export async function deleteTestimonial(id: string) {
  return prisma.testimonial.delete({ where: { id } })
}
