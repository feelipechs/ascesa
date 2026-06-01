import type { Metadata } from 'next'
import { auth } from '@/auth'
import { headers } from 'next/headers'
import { ProjectsContent, ProjectsHero } from './_sections'
import { PageSection } from '@/components/page-section'

export const metadata: Metadata = {
  title: 'Projetos — Ascesa',
  description:
    'Conheça os projetos, eventos e campanhas da Ascesa. Participe como voluntário e ajude a transformar a vida de animais abandonados.',
}

export default async function ProjectsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const isAuthenticated = !!session
  return (
    <main className="flex flex-col pt-17.5">
      <ProjectsHero />
      <PageSection padding="compact">
        <ProjectsContent isAuthenticated={isAuthenticated} />
      </PageSection>
    </main>
  )
}
