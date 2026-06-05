'use client'

import { useProjects } from '@/hooks/projects/queries'
import { Hero } from './home-hero'
import { StatsSection } from './stats-section'
import { ProjectsCarousel } from './projects-section'
import { TestimonialsSection } from './testimonials-section'
import { GallerySection } from '@/components/gallery-section'
import { PartnersContent } from './partners-content'

type HomeContentProps = {
  isAuthenticated?: boolean
}

export function HomeContent({ isAuthenticated }: HomeContentProps) {
  const { data: projectsResponse } = useProjects({ featured: true })
  const projects = projectsResponse?.data ?? []

  return (
    <>
      <Hero />
      <StatsSection isAuthenticated={isAuthenticated} />
      <ProjectsCarousel projects={projects.slice(0, 6)} />
      <TestimonialsSection isAuthenticated={isAuthenticated} />
      <GallerySection
        context="HOME"
        isAuthenticated={isAuthenticated}
        title={
          <>
            Nossa <span className="text-primary underline underline-offset-4">Galeria</span>
          </>
        }
        description="Momentos que mostram o impacto do nosso trabalho nas comunidades."
        wrapInPageSection
      />
      <PartnersContent isAuthenticated={isAuthenticated} />
    </>
  )
}
