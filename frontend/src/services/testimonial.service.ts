import { prisma } from '@/lib/prisma'

export async function getTestimonials() {
  return prisma.testimonial.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export async function getTestimonialById(id: string) {
  return prisma.testimonial.findUnique({
    where: { id },
  })
}

export async function createTestimonial(data: {
  name: string
  role?: string
  message: string
}) {
  return prisma.testimonial.create({ data })
}

export async function updateTestimonial(
  id: string,
  data: {
    name?: string
    role?: string
    message?: string
  }
) {
  return prisma.testimonial.update({ where: { id }, data })
}

export async function deleteTestimonial(id: string) {
  return prisma.testimonial.delete({ where: { id } })
}
