'use client'

import { EmptyState } from '@/components/empty-state'
import { SafeImage } from '@/components/safe-image'
import { ImagePlaceholder } from '@/components/image-placeholder'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import type { ProjectListItem } from '@/types'

type RelatedProjectsProps = {
  projects: ProjectListItem[]
}

export function RelatedProjects({ projects }: RelatedProjectsProps) {
  if (projects.length === 0) {
    return <EmptyState title="Ainda não há projetos cadastrados nesta área." />
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Card className="group flex h-full flex-col overflow-hidden border-border/50 py-0 transition-all duration-300 hover:border-primary/30 hover:shadow-md">
            <div className="relative h-40 overflow-hidden">
      {project.coverMedia?.url ? (
        <SafeImage
          src={project.coverMedia.url}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <ImagePlaceholder className="h-full w-full" />
              )}
              {project.featured && (
                <div className="absolute right-3 top-3">
                  <Badge>Destaque</Badge>
                </div>
              )}
            </div>
            <CardContent className="flex flex-1 flex-col space-y-2 p-4">
              <h4 className="font-semibold leading-tight">{project.title}</h4>
              {project.description && (
                <p className="line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
