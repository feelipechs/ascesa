'use client'

import { AreaCard } from './area-card'
import { EmptyState } from '@/components/shared/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import type { AreaListItem } from '@/types'

type AreasGridProps = {
  areas: AreaListItem[]
  isLoading?: boolean
  isAuthenticated?: boolean
  onEdit?: (area: { id: string }) => void
  onDelete?: (area: { id: string }) => void
}

export function AreasGrid({ areas, isLoading, isAuthenticated, onEdit, onDelete }: AreasGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-72 rounded-xl" />
        ))}
      </div>
    )
  }

  if (areas.length === 0) {
    return <EmptyState title="Nenhuma área encontrada com os filtros selecionados." className="min-h-[300px]" />
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in-0 duration-500">
      {areas.map((area) => (
        <div key={area.id}>
          <AreaCard area={area} isAuthenticated={isAuthenticated} onEdit={() => onEdit?.(area)} onDelete={() => onDelete?.(area)} />
        </div>
      ))}
    </div>
  )
}
