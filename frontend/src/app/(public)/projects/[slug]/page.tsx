import { notFound } from 'next/navigation'
import Link from 'next/link'
import { cache } from 'react'
import { SafeImage } from '@/components/safe-image'
import { ImagePlaceholder } from '@/components/image-placeholder'
import { format } from 'date-fns'
import { ArrowLeft, Calendar, MapPin, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getProjectBySlug } from '@/services/project.service'
import { auth } from '@/auth'
import { headers } from 'next/headers'
import { routes } from '@/lib/routes'
import { GallerySection } from '@/components/gallery-section'
import { VolunteerButton } from './_sections/volunteer-button'

const getCachedProject = cache((slug: string) => getProjectBySlug(slug))

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getCachedProject(slug)

  if (!project) return { title: 'Projeto não encontrado - Ascesa' }

  return {
    title: `${project.title} - Ascesa`,
    description: project.description,
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const session = await auth.api.getSession({ headers: await headers() })
  const isAuthenticated = !!session
  const project = await getCachedProject(slug)

  if (!project) notFound()

  return (
    <main className="min-h-screen bg-background">
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        {project.coverUrl ? (
          <SafeImage
            src={project.coverUrl}
            alt={project.title}
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
            <h1 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl text-balance">
              {project.title}
            </h1>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12">
        <Button variant="ghost" asChild className="mb-8 -ml-4">
          <Link href={routes.projects} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar para projetos
          </Link>
        </Button>

        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="mb-4 text-2xl font-semibold text-foreground">Sobre o Projeto</h2>
              <div className="prose max-w-none">
                {project.content ? (
                  project.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-muted-foreground leading-relaxed">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="text-muted-foreground">{project.description}</p>
                )}
              </div>
            </section>

              <GallerySection
                context="PROJECT"
                foreignKey={project.id}
                isAuthenticated={isAuthenticated}
              />
          </div>

          <aside className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-6">
                <h3 className="font-semibold text-lg text-foreground">Informações</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Área</p>
                      <p className="font-medium text-foreground">{project.area.title}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Publicado em</p>
                      <p className="font-medium text-foreground">
                        {project.publishedAt
                          ? format(project.publishedAt, 'dd/MM/yyyy')
                          : 'Não publicado'}
                      </p>
                    </div>
                  </div>

                  {project.eventDate && (
                    <>
                      <Separator />
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Data do evento</p>
                          <p className="font-medium text-foreground">
                            {format(project.eventDate, "dd 'de' MMMM 'de' yyyy")}
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {project.location && (
                    <>
                      <Separator />
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Local</p>
                          <p className="font-medium text-foreground">{project.location}</p>
                        </div>
                      </div>
                    </>
                  )}

                  {project.vacancies !== null && project.vacancies !== undefined && (
                    <>
                      <Separator />
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Vagas</p>
                          <p className="font-medium text-foreground">{project.vacancies}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
        </Card>

        <VolunteerButton projectId={project.id} projectTitle={project.title} />
      </aside>
        </div>
      </div>
    </main>
  )
}
