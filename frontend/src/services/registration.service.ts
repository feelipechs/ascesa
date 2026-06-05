import { prisma } from '@/lib/prisma'
import type { UpdateRegistrationInput, PublicRegistrationInput } from '@/schemas/registration.schema'
import { VolunteerService } from './volunteer.service'
import { EmailService } from './email.service'

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
    const registration = await prisma.registration.update({
      where: { id },
      data: { status: data.status },
      include: {
        volunteer: { select: { name: true, email: true } },
        project: { select: { title: true } },
      },
    })

    if (data.status === 'APPROVED') {
      await EmailService.sendApprovedEmail({
        to: registration.volunteer.email,
        volunteerName: registration.volunteer.name,
        projectTitle: registration.project.title,
      }).catch((err) => console.error('Falha ao enviar email de aprovação:', err))
    }

    if (data.status === 'REJECTED') {
      await EmailService.sendRejectedEmail({
        to: registration.volunteer.email,
        volunteerName: registration.volunteer.name,
        projectTitle: registration.project.title,
      }).catch((err) => console.error('Falha ao enviar email de rejeição:', err))
    }

    return registration
  },

  async delete(id: string) {
    return prisma.registration.delete({ where: { id } })
  },
}
