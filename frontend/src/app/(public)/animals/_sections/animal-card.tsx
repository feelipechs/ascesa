'use client'

import Link from 'next/link'
import { SafeImage } from '@/components/safe-image'
import { ImagePlaceholder } from '@/components/image-placeholder'
import { Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { routes } from '@/lib/routes'

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  AVAILABLE: { label: 'Disponível', variant: 'default' },
  ADOPTED: { label: 'Adotado', variant: 'secondary' },
  FOSTERED: { label: 'Lar Temporário', variant: 'outline' },
}

export function AnimalCard({
  animal,
}: {
  animal: {
    id: string
    name: string
    slug: string
    coverUrl: string | null
    description: string | null
    status: string
    gender: string
    breed: string | null
    species: { name: string }
    size: { label: string } | null
    shelterSince: string
  }
}) {
  const status = statusConfig[animal.status] ?? { label: animal.status, variant: 'outline' as const }

  return (
    <Link href={routes.animal(animal.slug)} className="block group">
      <Card className="overflow-hidden transition-[transform,box-shadow] duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="relative aspect-[4/3] overflow-hidden">
          {animal.coverUrl ? (
            <SafeImage
              src={animal.coverUrl}
              alt={animal.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <ImagePlaceholder className="w-full h-full" />
          )}
          <div className="absolute top-2 left-2">
            <Badge variant={status.variant} className="text-xs">
              {status.label}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
              {animal.name}
            </h3>
            <Badge variant="secondary" className="shrink-0 text-xs">
              {animal.species.name}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground mb-2">
            {animal.breed && <span>{animal.breed}</span>}
            <span>{animal.gender === 'MALE' ? 'Macho' : 'Fêmea'}</span>
            {animal.size && <span>{animal.size.label}</span>}
          </div>

          {animal.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {animal.description}
            </p>
          )}

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>No abrigo desde {format(animal.shelterSince, "MMM 'de' yyyy", { locale: ptBR })}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
