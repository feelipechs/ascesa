'use client'

import Link from 'next/link'
import { SafeImage } from '@/components/safe-image'
import { ImagePlaceholder } from '@/components/image-placeholder'
import { ArrowRight, Calendar, MapPin, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AdminActions } from '@/components/admin/admin-actions'
import { format } from 'date-fns'
import type { ProjectListItem } from '@/types'
import { VolunteerModal } from '@/components/volunteer-modal'

export function ProjectCard({
  project,
  isAuthenticated,
  onEdit,
  onDelete,
}: {
  project: ProjectListItem
  isAuthenticated?: boolean
  onEdit?: () => void
  onDelete?: () => void
}) {
  return (
    <div
      className={cn(
        'group flex flex-col h-full overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm',
        'border-border/50 transition-[transform,box-shadow,border-color] duration-300',
        'hover:shadow-lg hover:-translate-y-1 hover:border-border'
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden shrink-0">
        {project.coverUrl ? (
          <SafeImage
            src={project.coverUrl}
            alt={project.title}
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
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="flex flex-col flex-1 p-5 md:p-6">
        <div className="mb-3 flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs font-medium">
            {project.area.title}
          </Badge>
        </div>

        <h3 className="text-xl font-semibold tracking-tight mb-2 line-clamp-1 group-hover:text-primary">
          {project.title}
        </h3>

        {(project.eventDate || project.location) && (
          <div className="mb-3 space-y-1.5">
            {project.eventDate && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                <span>{format(project.eventDate, "dd 'de' MMMM 'de' yyyy")}</span>
              </div>
            )}
            {project.location && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span>{project.location}</span>
              </div>
            )}
            {project.vacancies !== null && project.vacancies !== undefined && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5 shrink-0" />
                <span>{project.vacancies} vagas</span>
              </div>
            )}
          </div>
        )}

        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 flex-1">
          {project.description}
        </p>

        <div className="mt-4 pt-4 border-t border-border/50 flex gap-2">
          <Button asChild variant="ghost" className="flex-1 group/btn">
            <Link href={`/projects/${project.slug}`}>
              Saiba mais
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </Button>
          {project.eventDate && (
            <VolunteerModal projectId={project.id} projectTitle={project.title}>
              <Button variant="default" className="shrink-0" onClick={(e) => e.stopPropagation()}>
                Inscrever-se
              </Button>
            </VolunteerModal>
          )}
        </div>
      </div>
    </div>
  )
}
