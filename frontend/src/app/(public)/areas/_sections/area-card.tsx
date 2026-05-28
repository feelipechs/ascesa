'use client'

import Link from 'next/link'
import { SafeImage } from '@/components/safe-image'
import { ImagePlaceholder } from '@/components/image-placeholder'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AdminActions } from '@/components/admin/admin-actions'
import { AreaIcon } from '@/components/area-icon'
import type { AreaListItem } from '@/types'

type AreaCardProps = {
  area: AreaListItem
  isAuthenticated?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

export function AreaCard({ area, isAuthenticated, onEdit, onDelete }: AreaCardProps) {
  return (
    <Card className="group relative flex h-full flex-col overflow-hidden border-border/50 transition-[transform,box-shadow,border-color] duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-border py-0">
      {isAuthenticated && onEdit && onDelete && (
        <div className="absolute top-3 right-3 z-10">
          <AdminActions onEdit={onEdit} onDelete={onDelete} />
        </div>
      )}

      {/* Image Area */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary to-primary/60">
        {area.coverUrl ? (
          <SafeImage
            src={area.coverUrl}
            alt={area.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <ImagePlaceholder className="h-full w-full" />
        )}

        {/* Icon + Title Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent flex flex-col justify-end p-4">
          <div className="flex items-center gap-3">
            {area.iconName && <AreaIcon name={area.iconName} size={28} className="text-primary-foreground" />}
            <h3 className="text-lg font-semibold text-primary-foreground">{area.title}</h3>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <CardContent className="flex flex-col flex-1 p-4">
        <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {area.description}
        </p>

        {/* Stats Badges */}
        <div className="mb-4 flex gap-2 flex-wrap">
          <Badge variant="secondary">{area._count?.projects ?? 0} projetos</Badge>
          <Badge variant="secondary">{area._count?.members ?? 0} membros</Badge>
        </div>

        <Button asChild variant="ghost" className="w-full gap-2">
          <Link href={`/areas/${area.slug}`}>
            Ver área
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
