'use client'

import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Calendar, MapPin, Users, UserCheck, Clock, X } from 'lucide-react'
import { ptBR } from 'date-fns/locale'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/empty-state'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { projectsWithVolunteersQueryOptions } from '@/hooks/projects/queries'
import { useRegistrationMutations } from '@/hooks/registrations/queries'

export function ProjectsContent() {
  const { data: projects = [], isLoading } = useQuery(projectsWithVolunteersQueryOptions())
  const { updateStatus } = useRegistrationMutations()

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
                          {format(new Date(project.eventDate), "dd 'de' MMMM 'de' yyyy", {
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
                {project.registrations.length > 0 ? (
                  <div className="space-y-2">
                    {project.registrations.map((reg) => (
                      <div
                        key={reg.id}
                        className="flex items-center justify-between gap-2 rounded-lg bg-muted/50 p-2.5 text-sm"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{reg.volunteer.name}</p>
                          <p className="text-muted-foreground truncate text-xs">
                            {reg.volunteer.email}
                          </p>
                        </div>
                        <Select
                          value={reg.status}
                          onValueChange={(value) =>
                            updateStatus.mutate({ id: reg.id, data: { status: value } })
                          }
                        >
                          <SelectTrigger className="h-7 w-35 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">
                              <Clock className="h-3 w-3 mr-1 inline" /> Pendente
                            </SelectItem>
                            <SelectItem value="APPROVED">
                              <UserCheck className="h-3 w-3 mr-1 inline" /> Aprovado
                            </SelectItem>
                            <SelectItem value="REJECTED">
                              <X className="h-3 w-3 mr-1 inline" /> Rejeitado
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhum voluntário inscrito neste evento.
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
