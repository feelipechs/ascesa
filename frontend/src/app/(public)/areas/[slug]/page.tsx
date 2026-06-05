import Link from 'next/link'
import { SafeImage } from '@/components/safe-image'
import { ImagePlaceholder } from '@/components/image-placeholder'
import { notFound } from 'next/navigation'
import { areaIconMap } from '@/lib/area-icon-map'
import { routes } from '@/lib/routes'
import { ArrowLeft, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RelatedProjects, TeamSectionWrapper } from '../_sections'
import { getAreaBySlug, getAreas } from '@/services/area.service'
import { auth } from '@/auth'
import { headers } from 'next/headers'
import type { Metadata } from 'next'
import type { TeamMemberWithAreas } from '@/types'
import { PageSection } from '@/components/page-section'
import { SectionHeading } from '@/components/section-heading'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const areas = await getAreas()
  return areas.map((area) => ({ slug: area.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const area = await getAreaBySlug(slug)
  if (!area) return { title: 'Área não encontrada' }
  return {
    title: `${area.title} | Áreas de Atuação`,
    description: area.description ?? undefined,
  }
}

export default async function AreaDetailPage({ params }: Props) {
  const { slug } = await params
  const session = await auth.api.getSession({ headers: await headers() })
  const isAuthenticated = !!session
  const area = await getAreaBySlug(slug)
  if (!area) notFound()

  const members = area.members.map((m) => m.teamMember)

  return (
    <main className="min-h-screen">
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        {area.coverMedia?.url ? (
          <SafeImage
            src={area.coverMedia.url}
            alt={area.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <ImagePlaceholder className="h-full w-full" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent" />
        <header className="absolute inset-0 flex flex-col justify-end">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-12">
            <h1 className="flex items-center gap-4 text-4xl font-bold text-primary-foreground md:text-5xl lg:text-6xl text-balance">
          {area.iconName && (() => {
            const Icon = areaIconMap[area.iconName]
            if (!Icon) return null
            return (
              <span className="inline-flex items-center justify-center rounded-full bg-primary-foreground/10 p-2">
                <Icon size={32} className="text-primary-foreground" />
              </span>
            )
          })()}
              {area.title}
            </h1>
          </div>
        </header>
      </section>

      <PageSection padding="compact">
        <Button variant="ghost" asChild className="-ml-4 mb-6">
          <Link href={routes.areas} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar para áreas
          </Link>
        </Button>

        {area.description && (
          <p className="mb-6 text-lg text-muted-foreground text-pretty">
            {area.description}
          </p>
        )}

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <Heart className="size-4 text-primary" />
            {area.projects.length} projetos
          </span>
          <span className="flex items-center gap-2">
            <Heart className="size-4 text-primary" />
            {members.length} membros na equipe
          </span>
        </div>
      </PageSection>

      <PageSection borderTop>
        <SectionHeading
          title="Projetos"
          description="Conheça os projetos que desenvolvemos nesta área de atuação."
        />
        <RelatedProjects projects={area.projects} />
      </PageSection>

      <PageSection borderTop sectionClassName="bg-card">
        <SectionHeading
          title="Nossa Equipe"
          description="Conheça os voluntários e profissionais que fazem a diferença nesta área."
        />
        <TeamSectionWrapper isAuthenticated={isAuthenticated} areaId={area.id} initialMembers={members as TeamMemberWithAreas[]} />
      </PageSection>

      <PageSection borderTop>
        <div className="mx-auto max-w-2xl rounded-2xl bg-primary/5 p-8 text-center md:p-12">
          <div className="mb-6 inline-flex size-16 items-center justify-center rounded-full bg-primary/10">
            <Heart className="size-8 text-primary" />
          </div>
          <SectionHeading title="Quer contribuir com esta área?" />
          <p className="mb-8 text-muted-foreground">
            Sua participação é fundamental para continuarmos transformando vidas.
          </p>
          <div className="flex justify-center">
        <Button size="lg" className="gap-2" asChild>
          <Link href={routes.contact}>
            <Heart className="size-5" />
            Entre em contato
          </Link>
        </Button>
          </div>
        </div>
      </PageSection>
    </main>
  )
}
