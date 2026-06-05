'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { formatUTC } from '@/lib/utils-date'
import { Calendar, MapPin, Users, Eye } from 'lucide-react'
import { ptBR } from 'date-fns/locale'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/empty-state'
import { projectsWithVolunteersQueryOptions } from '@/hooks/projects/queries'
import { ProjectVolunteersSheet } from './project-volunteers-sheet'

type ProjectData = Awaited<ReturnType<typeof import('@/lib/api/projects').ProjectsApi.findWithVolunteers>>[number]

export function ProjectsContent() {
  const { data: projects = [], isLoading } = useQuery(projectsWithVolunteersQueryOptions())
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null)

  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projetos</h1>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          title="Nenhum evento encontrado."
          description="Crie um projeto com data de evento para ver voluntários inscritos."
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <CardDescription className="flex flex-col gap-1 mt-2">
                      {project.eventDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {formatUTC(project.eventDate, "dd 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })}
                        </span>
                      )}
                      {project.location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          {project.location}
                        </span>
                      )}
                      {project.vacancies && (
                        <span className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5" />
                          {project.vacancies} vagas
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    {project.registrations.length} inscrito
                    {project.registrations.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setSelectedProject(project)}
                  disabled={project.registrations.length === 0}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver voluntários
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedProject && (
        <ProjectVolunteersSheet
          open={!!selectedProject}
          onOpenChange={(open) => {
            if (!open) setSelectedProject(null)
          }}
          projectTitle={selectedProject.title}
          registrations={selectedProject.registrations.map((reg) => ({
            id: reg.id,
            status: reg.status,
            volunteerName: reg.volunteer.name,
            volunteerEmail: reg.volunteer.email,
            volunteerPhone: reg.volunteer.phone,
            message: reg.message ?? null,
          }))}
        />
      )}
    </div>
  )
}
