import { prisma } from '@/lib/prisma'
import { SectionCards } from './_sections/section-cards'
import { DashboardCharts } from './_sections/dashboard-charts'
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns'

export default async function AdminPage() {
  const now = new Date()

  const [
    projectsCount,
    eventsCount,
    campaignsCount,
    areasCount,
    teamMembersCount,
    partnersCount,
    documentsCount,
    volunteersCount,
    pendingRegistrationsCount,
    usersCount,
    postsCount,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { context: 'EVENT' } }),
    prisma.project.count({ where: { context: 'CAMPAIGN' } }),
    prisma.area.count(),
    prisma.teamMember.count(),
    prisma.partner.count(),
    prisma.document.count(),
    prisma.volunteer.count(),
    prisma.registration.count({ where: { status: 'PENDING' } }),
    prisma.user.count(),
    prisma.post.count(),
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

  const postsByMonth = await Promise.all(
    last6Months.map(async ({ start, end, label }) => ({
      month: label,
      count: await prisma.post.count({
        where: { publishedAt: { gte: start, lte: end } },
      }),
    }))
  )

  const registrationsByStatus = await Promise.all(
    (['PENDING', 'APPROVED', 'REJECTED'] as const).map(async (status) => ({
      status,
      count: await prisma.registration.count({ where: { status } }),
    }))
  )

  const projectsByContext = await Promise.all(
    (['CAMPAIGN', 'EVENT'] as const).map(async (context) => ({
      context,
      count: await prisma.project.count({ where: { context } }),
    }))
  )

  return (
    <div className="px-4 lg:px-6">
      <SectionCards
        projects={projectsCount}
        events={eventsCount}
        campaigns={campaignsCount}
        areas={areasCount}
        teamMembers={teamMembersCount}
        partners={partnersCount}
        documents={documentsCount}
        volunteers={volunteersCount}
        pendingRegistrations={pendingRegistrationsCount}
        users={usersCount}
        posts={postsCount}
      />
      <DashboardCharts
        volunteersByMonth={volunteersByMonth}
        registrationsByStatus={registrationsByStatus}
        projectsByContext={projectsByContext}
        postsByMonth={postsByMonth}
      />
    </div>
  )
}
