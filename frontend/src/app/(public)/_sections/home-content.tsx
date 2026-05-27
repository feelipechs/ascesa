'use client'
import { useProjects } from '@/hooks/projects/queries'
import { Hero } from './hero'
import { StatsSection } from './stats-section'
import { ProjectsCarousel } from './projects-carousel'
import { ImpactBanner } from './impact-banner'
import { GalleryContent } from './gallery-content'
import { PartnersContent } from './partners-content'

type HomeContentProps = {
  isAuthenticated?: boolean
}

export function HomeContent({ isAuthenticated }: HomeContentProps) {
  const { data: projectsResponse } = useProjects({ featured: true })
  const projects = projectsResponse?.data ?? []

  return (
    <main className="flex flex-col">
      <Hero />
      <StatsSection />
      <ProjectsCarousel projects={projects.slice(0, 6)} />
      <ImpactBanner />
      <GalleryContent isAuthenticated={isAuthenticated} />
      <PartnersContent isAuthenticated={isAuthenticated} />
    </main>
  )
}
