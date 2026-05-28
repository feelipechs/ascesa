'use client'

import { ProjectCard } from './project-card'
import { EmptyState } from '@/components/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import type { ProjectListItem } from '@/types'

type ProjectsGridProps = {
  projects: ProjectListItem[]
  isLoading?: boolean
  isAuthenticated?: boolean
  onEdit?: (project: { id: string }) => void
  onDelete?: (project: { id: string }) => void
}

export function ProjectsGrid({
  projects,
  isLoading,
  isAuthenticated,
  onEdit,
  onDelete,
}: ProjectsGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
        ))}
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <EmptyState
        title="Nenhum projeto encontrado."
        description="Tente outros termos ou remova os filtros."
      />
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-in fade-in-0 duration-500">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          isAuthenticated={isAuthenticated}
          onEdit={() => onEdit?.(project)}
          onDelete={() => onDelete?.(project)}
        />
      ))}
    </div>
  )
}
