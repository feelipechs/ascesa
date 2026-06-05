import { prisma } from '@/lib/prisma'
import { SectionCards } from './_sections/section-cards'
import { DashboardCharts } from './_sections/dashboard-charts'
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns'

export default async function AdminPage() {
  const now = new Date()

  const [
    areasCount,
    projectsCount,
    volunteersCount,
    postsCount,
    animalsCount,
    paymentMethodsCount,
    testimonialsCount,
    fiscalNotesCount,
    usersCount,
    teamMembersCount,
    partnersCount,
    documentsCount,
    galleryImagesCount,
  ] = await Promise.all([
    prisma.area.count(),
    prisma.project.count(),
    prisma.volunteer.count(),
    prisma.post.count(),
    prisma.animal.count(),
    prisma.paymentMethod.count(),
    prisma.testimonial.count(),
    prisma.fiscalNote.count(),
    prisma.user.count(),
    prisma.teamMember.count(),
    prisma.partner.count(),
    prisma.document.count(),
    prisma.galleryImage.count(),
  ])

  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(now, 5 - i)
    return { start: startOfMonth(date), end: endOfMonth(date), label: format(date, 'MMM/yy') }
  })

  const volunteersByMonth = await Promise.all(
    last6Months.map(async ({ start, end, label }) => ({
      month: label,
      count: await prisma.volunteer.count({
        where: { createdAt: { gte: start, lte: end } },
      }),
    }))
  )

  const registrationsByStatus = await Promise.all(
    (['PENDING', 'APPROVED', 'REJECTED'] as const).map(async (status) => ({
      status,
      count: await prisma.registration.count({ where: { status } }),
    }))
  )

  return (
    <div className="px-4 lg:px-6">
      <SectionCards
        areas={areasCount}
        projects={projectsCount}
        volunteers={volunteersCount}
        posts={postsCount}
        animals={animalsCount}
        paymentMethods={paymentMethodsCount}
        testimonials={testimonialsCount}
        fiscalNotes={fiscalNotesCount}
        users={usersCount}
        teamMembers={teamMembersCount}
        partners={partnersCount}
        documents={documentsCount}
        galleryImages={galleryImagesCount}
      />
      <DashboardCharts
        volunteersByMonth={volunteersByMonth}
        registrationsByStatus={registrationsByStatus}
      />
    </div>
  )
}
