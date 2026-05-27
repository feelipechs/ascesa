import type { Metadata } from 'next'
import { auth } from '@/auth'
import { ProjectsContent, ProjectsHero } from './_sections'

export const metadata: Metadata = {
  title: 'Projetos — Ascesa',
  description:
    'Conheça os projetos, eventos e campanhas da Ascesa. Participe como voluntário e ajude a transformar a vida de animais abandonados.',
}

export default async function ProjectsPage() {
  const session = await auth()
  const isAuthenticated = !!session
  return (
    <main className="flex flex-col pt-17.5">
      <ProjectsHero />
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <ProjectsContent isAuthenticated={isAuthenticated} />
        </div>
      </section>
    </main>
  )
}
