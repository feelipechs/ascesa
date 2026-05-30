import { notFound } from 'next/navigation'
import { cache } from 'react'
import { AnimalService } from '@/services/animal.service'
import { SafeImage } from '@/components/safe-image'
import { ImagePlaceholder } from '@/components/image-placeholder'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Calendar, Heart, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { routes } from '@/lib/routes'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { AnimalGallerySection } from './_sections/animal-gallery-section'

const getCachedAnimal = cache((slug: string) => AnimalService.findBySlug(slug))

const statusConfig: Record<
  string,
  { label: string; variant: 'default' | 'secondary' | 'outline' }
> = {
  AVAILABLE: { label: 'Disponível para adoção', variant: 'default' },
  ADOPTED: { label: 'Adotado', variant: 'secondary' },
  FOSTERED: { label: 'Lar Temporário', variant: 'outline' },
}

const genderLabel: Record<string, string> = { MALE: 'Macho', FEMALE: 'Fêmea' }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const animal = await getCachedAnimal(slug)
  if (!animal) return { title: 'Animal não encontrado — Ascesa' }
  return {
    title: `${animal.name} — Ascesa`,
    description: animal.description ?? `Conheça ${animal.name}, disponível para adoção.`,
  }
}

export default async function AnimalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const session = await auth()
  const isAuthenticated = !!session
  const [animal, settings] = await Promise.all([
    getCachedAnimal(slug),
    prisma.siteSettings.findUnique({ where: { id: 'main' } }),
  ])

  if (!animal) notFound()

  const status = statusConfig[animal.status] ?? {
    label: animal.status,
    variant: 'outline' as const,
  }

  return (
    <main className="min-h-screen bg-background pt-17.5">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Button variant="ghost" asChild className="mb-6 -ml-4">
          <Link href={routes.animals} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar para animais
          </Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
            {animal.coverUrl ? (
              <SafeImage
                src={animal.coverUrl}
                alt={animal.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <ImagePlaceholder className="w-full h-full" />
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold md:text-4xl">{animal.name}</h1>
                <Badge variant={status.variant}>{status.label}</Badge>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span>{animal.species.name}</span>
                {animal.breed && <span>{animal.breed}</span>}
                <span>{genderLabel[animal.gender] ?? animal.gender}</span>
                {animal.size && <span>{animal.size.label}</span>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm bg-muted/50 rounded-lg p-3">
                <Calendar className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Nascimento</p>
                  <p className="font-medium">
                    {animal.birthDate ? format(animal.birthDate, 'dd/MM/yyyy') : 'Não informado'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm bg-muted/50 rounded-lg p-3">
                <Heart className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">No abrigo desde</p>
                  <p className="font-medium">
                    {format(animal.shelterSince, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>
              </div>
            </div>

            {animal.description && <p className="text-muted-foreground">{animal.description}</p>}

            {animal.content && (
              <div className="prose max-w-none">
                {animal.content.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="text-muted-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {settings?.socialWhatsapp && (
                <Button asChild size="lg" className="flex-1">
                  <a
                    href={`https://wa.me/${settings.socialWhatsapp}?text=Olá! Tenho interesse em adotar o ${animal.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Quero Adotar
                  </a>
                </Button>
              )}
              <Button asChild variant="outline" size="lg" className="flex-1">
                <Link href={routes.donate}>Apadrinhar</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <AnimalGallerySection animalId={animal.id} isAuthenticated={isAuthenticated} />
        </div>
      </div>
    </main>
  )
}
