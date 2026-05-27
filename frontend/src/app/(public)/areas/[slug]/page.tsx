import Link from 'next/link'
import { SafeImage } from '@/components/shared/safe-image'
import { ImagePlaceholder } from '@/components/shared/image-placeholder'
import { notFound } from 'next/navigation'
import * as icons from 'lucide-react'
import { ArrowLeft, FolderKanban, Users, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RelatedProjects, TeamSectionWrapper } from '../_sections'
import { getAreaBySlug, getAreas } from '@/services/area.service'
import { auth } from '@/auth'
import type { Metadata } from 'next'

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
  const session = await auth()
  const isAuthenticated = !!session
  const area = await getAreaBySlug(slug)
  if (!area) notFound()

  const members = area.members.map((m) => m.teamMember)

  return (
    <main className="min-h-screen">
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        {area.coverUrl ? (
          <SafeImage
            src={area.coverUrl}
            alt={area.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <ImagePlaceholder className="h-full w-full" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="mx-auto max-w-6xl px-4 pb-12">
            <h1 className="flex items-center gap-4 text-4xl font-bold text-primary-foreground md:text-5xl lg:text-6xl text-balance">
              {area.iconName && (() => {
                const Icon = icons[area.iconName as keyof typeof icons] as React.ElementType | undefined
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
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12">
        <Button variant="ghost" asChild className="mb-8 -ml-4">
          <Link href="/areas" className="flex items-center gap-2">
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
            <FolderKanban className="size-4 text-primary" />
            {area.projects.length} projetos
          </span>
          <span className="flex items-center gap-2">
            <Users className="size-4 text-primary" />
            {members.length} membros na equipe
          </span>
        </div>
      </div>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10">
            <h2 className="mb-2 text-2xl font-bold md:text-3xl">Projetos</h2>
            <p className="text-muted-foreground">
              Conheça os projetos que desenvolvemos nesta área de atuação.
            </p>
          </div>
          <RelatedProjects projects={area.projects} />
        </div>
      </section>

      <section className="border-t border-border/50 bg-card py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10">
            <h2 className="mb-2 text-2xl font-bold md:text-3xl">Nossa Equipe</h2>
            <p className="text-muted-foreground">
              Conheça os voluntários e profissionais que fazem a diferença nesta área.
            </p>
          </div>
          <TeamSectionWrapper isAuthenticated={isAuthenticated} areaId={area.id} />
        </div>
      </section>

      <section className="border-t border-border/50 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl rounded-2xl bg-primary/5 p-8 text-center md:p-12">
            <div className="mb-6 inline-flex size-16 items-center justify-center rounded-full bg-primary/10">
              <Heart className="size-8 text-primary" />
            </div>
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">Quer contribuir com esta área?</h2>
            <p className="mb-8 text-muted-foreground">
              Sua participação é fundamental para continuarmos transformando vidas.
            </p>
            <div className="flex justify-center">
              <Button size="lg" className="gap-2">
                <Heart className="size-5" />
                Entre em contato
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
