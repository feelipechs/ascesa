import { prisma } from '@/lib/prisma'
import type { UpdateRegistrationInput, PublicRegistrationInput } from '@/schemas/registration.schema'
import { VolunteerService } from './volunteer.service'

export const RegistrationService = {
  async findAll(filters?: { projectId?: string; volunteerId?: string; status?: string }) {
    const where: Record<string, unknown> = {}
    if (filters?.projectId) where.projectId = filters.projectId
    if (filters?.volunteerId) where.volunteerId = filters.volunteerId
    if (filters?.status) where.status = filters.status

    return prisma.registration.findMany({
      where,
      include: {
        volunteer: { select: { id: true, name: true, email: true, phone: true } },
        project: { select: { id: true, title: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  async findById(id: string) {
    return prisma.registration.findUnique({
      where: { id },
      include: {
        volunteer: { select: { id: true, name: true, email: true, phone: true } },
        project: { select: { id: true, title: true, slug: true, eventDate: true } },
      },
    })
  },

  async publicRegister(data: PublicRegistrationInput) {
    const volunteer = await VolunteerService.upsertByEmail({
      name: data.name,
      email: data.email,
      phone: data.phone,
    })

    return prisma.registration.create({
      data: {
        volunteerId: volunteer.id,
        projectId: data.projectId,
        message: data.message,
        status: 'PENDING',
      },
    })
  },

  async updateStatus(id: string, data: UpdateRegistrationInput) {
    return prisma.registration.update({ where: { id }, data: { status: data.status } })
  },

  async delete(id: string) {
    return prisma.registration.delete({ where: { id } })
  },
}
