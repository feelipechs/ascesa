'use client'

import Link from 'next/link'
import { ImagePlaceholder } from '@/components/image-placeholder'
import { Calendar, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SafeImage } from '@/components/safe-image'
import { AdminActions } from '@/components/admin/admin-actions'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { routes } from '@/lib/routes'

const statusConfig: Record<
  string,
  { label: string; variant: 'default' | 'secondary' | 'outline' }
> = {
  AVAILABLE: { label: 'Disponível', variant: 'default' },
  ADOPTED: { label: 'Adotado', variant: 'secondary' },
  FOSTERED: { label: 'Lar Temporário', variant: 'outline' },
}

const genderMap: Record<string, string> = {
  MALE: 'Macho',
  FEMALE: 'Fêmea',
}

export function AnimalCard({
  animal,
  isAuthenticated,
  onEdit,
  onDelete,
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
  isAuthenticated?: boolean
  onEdit?: () => void
  onDelete?: () => void
}) {
  const status = statusConfig[animal.status] ?? {
    label: animal.status,
    variant: 'outline' as const,
  }
  const gender = genderMap[animal.gender] ?? null

  return (
    <div
      className={cn(
        'group flex flex-col h-full overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm',
        'border-border/50 transition-[transform,box-shadow,border-color] duration-300',
        'hover:shadow-lg hover:-translate-y-1 hover:border-border'
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden shrink-0">
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
        {isAuthenticated && onEdit && onDelete && (
          <div className="absolute top-2 right-2 z-10">
            <AdminActions onEdit={onEdit} onDelete={onDelete} />
          </div>
        )}
        <div className="absolute top-2 left-2">
          <Badge variant={status.variant} className="text-xs">
            {status.label}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5 md:p-6">
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
          {gender && <span>{gender}</span>}
          {animal.size && <span>{animal.size.label}</span>}
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            No abrigo desde{' '}
            {format(new Date(animal.shelterSince), "MMM 'de' yyyy", { locale: ptBR })}
          </span>
        </div>

        {animal.description && (
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 flex-1">
            {animal.description}
          </p>
        )}

        <div className="mt-4 pt-4 border-t border-border/50 flex gap-2">
          <Button asChild variant="ghost" className="flex-1 group/btn">
            <Link href={routes.animal(animal.slug)}>
              Saiba mais
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
