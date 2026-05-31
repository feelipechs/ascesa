'use client'

import * as React from 'react'
import Autoplay from 'embla-carousel-autoplay'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import type { ProjectListItem } from '@/types'
import { ProjectCard } from '@/app/(public)/projects/_sections/project-card'
import { PageSection } from '@/components/page-section'
import { SectionHeading } from '@/components/section-heading'

type ProjectsCarouselProps = {
  projects: ProjectListItem[]
  autoplay?: boolean
  className?: string
}

export function ProjectsCarousel({ projects, autoplay = true, className }: ProjectsCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  const plugin = React.useRef(Autoplay({ delay: 4000, stopOnInteraction: true }))

  React.useEffect(() => {
    if (!api) return
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  if (projects.length === 0) return null

  return (
    <PageSection padding="compact" className={className}>
      <SectionHeading
        title="Projetos em Destaque"
        description="Conheça alguns dos projetos que transformam vidas."
      />

      <Carousel
        setApi={setApi}
        opts={{
          align: 'start',
          loop: true,
        }}
        plugins={autoplay ? [plugin.current] : []}
        className="w-full max-w-6xl mx-auto"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {projects.map((project, index) => (
            <CarouselItem
              key={project.id}
              className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <ProjectCard project={project} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="hidden md:block">
          <CarouselPrevious className="-left-12 lg:-left-16" />
          <CarouselNext className="-right-12 lg:-right-16" />
        </div>
      </Carousel>

      {/* Indicadores (Dots) */}
      <div className="flex justify-center gap-2 mt-6 md:mt-8">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              'w-2.5 h-2.5 rounded-full transition-all duration-300',
              index === current
                ? 'bg-primary w-8'
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            )}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navegação mobile */}
      <div className="flex justify-center gap-4 mt-6 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => api?.scrollPrev()}
          aria-label="Slide anterior"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => api?.scrollNext()}
          aria-label="Próximo slide"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </PageSection>
  )
}
