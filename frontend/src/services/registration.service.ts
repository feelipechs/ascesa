import { prisma } from '@/lib/prisma'
import { calculatePaginationMeta } from '@/lib/pagination'
import { BusinessError } from '@/lib/api-handler'
import type { Prisma } from '@/generated/prisma/client'
import type { UpdateRegistrationInput, PublicRegistrationInput } from '@/schemas/registration.schema'
import { VolunteerService } from './volunteer.service'
import { EmailService } from './email.service'
import type { RegistrationFilters } from '@/types'

const DEFAULT_LIMIT = 12

export const RegistrationService = {
  async findAll(filters: RegistrationFilters = {}) {
    const page = filters.page ?? 1
    const limit = filters.limit ?? DEFAULT_LIMIT
    const skip = (page - 1) * limit

    const where: Prisma.RegistrationWhereInput = {}
    if (filters.projectId) where.projectId = filters.projectId
    if (filters.volunteerId) where.volunteerId = filters.volunteerId
    if (filters.status) where.status = filters.status

    const [data, total] = await Promise.all([
      prisma.registration.findMany({
        where,
        include: {
          volunteer: { select: { id: true, name: true, email: true, phone: true } },
          project: { select: { id: true, title: true, slug: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.registration.count({ where }),
    ])

    return { data, meta: calculatePaginationMeta(total, page, limit) }
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
    const [project, registrationsCount] = await Promise.all([
      prisma.project.findUnique({ where: { id: data.projectId }, select: { vacancies: true } }),
      prisma.registration.count({ where: { projectId: data.projectId } }),
    ])

    if (project?.vacancies != null && registrationsCount >= project.vacancies) {
      throw new BusinessError('Projeto não possui vagas disponíveis', 409)
    }

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
