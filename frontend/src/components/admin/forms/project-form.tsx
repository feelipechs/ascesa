'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createProjectSchema, updateProjectSchema } from '@/schemas/project.schema'
import { toDateInput } from '@/lib/utils-date'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAreas } from '@/hooks/areas/queries'
import { useProjectMutations, projectQueryOptions } from '@/hooks/projects/queries'
import { useQuery } from '@tanstack/react-query'
import { toSlug } from '@/lib/utils'
import { TitleField } from './fields/title-field'
import { SlugField } from './fields/slug-field'
import { DescriptionField } from './fields/description-field'
import { ImageUploadField } from './fields/image-upload-field'
import { Skeleton } from '@/components/ui/skeleton'
import type { ProjectWithDetails } from '@/types'

type ProjectData = ProjectWithDetails

type ProjectFormProps = {
  projectId?: string
  onSuccess: () => void
  onCancel: () => void
}

export function ProjectForm({ projectId, onSuccess, onCancel }: ProjectFormProps) {
  const isEditing = !!projectId
  const { data: projectData, isLoading } = useQuery(projectQueryOptions(projectId))

  if (isEditing && isLoading) {
    return <Skeleton className="h-96 w-full" />
  }

  if (isEditing && !projectData) {
    return null
  }

  return (
    <ProjectFormInner
      projectId={projectId}
      projectData={projectData as ProjectData | undefined}
      onSuccess={onSuccess}
      onCancel={onCancel}
    />
  )
}

type ProjectFormInnerProps = {
  projectId?: string
  projectData?: ProjectData
  onSuccess: () => void
  onCancel: () => void
}

function ProjectFormInner({ projectId, projectData, onSuccess, onCancel }: ProjectFormInnerProps) {
  const isEditing = !!projectId
  const { create, update, isPending } = useProjectMutations()
  const { data: areasData, isLoading: areasLoading } = useAreas()
  const areas = areasData ?? []

  const form = useForm({
    resolver: zodResolver(isEditing ? updateProjectSchema : createProjectSchema),
    defaultValues: {
      title: projectData?.title ?? '',
      slug: projectData?.slug ?? '',
      description: projectData?.description ?? '',
      content: projectData?.content ?? '',
      coverMediaId: projectData?.coverMediaId ?? '',
      areaId: projectData?.areaId ?? '',
      featured: projectData?.featured ?? false,
      eventDate: projectData?.eventDate ? toDateInput(projectData.eventDate) : '',
      location: projectData?.location ?? '',
      vacancies: projectData?.vacancies ?? null as number | null,
    },
  })

  function handleSubmit(data: Record<string, unknown>) {
    const payload = {
      ...data,
      coverMediaId: (data.coverMediaId as string) || undefined,
      eventDate: (data.eventDate as string) || null,
      vacancies: data.vacancies ? Number(data.vacancies) : null,
    }
    if (isEditing && projectId) {
      update.mutate({ id: projectId, data: payload }, { onSuccess })
    } else {
      create.mutate(payload, { onSuccess })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
      <Controller
        control={form.control}
        name="title"
        render={({ field }) => (
          <TitleField
            value={field.value ?? ''}
            onChange={(value) => {
              field.onChange(value)
              if (!isEditing) form.setValue('slug', toSlug(value))
            }}
          />
        )}
      />

      <Controller
        control={form.control}
        name="slug"
        render={({ field }) => (
          <SlugField value={field.value ?? ''} onChange={field.onChange} previewUrl="projetos" />
        )}
      />

      <div className="flex flex-col gap-2">
        <Label htmlFor="areaId">Área</Label>
        <Controller
          control={form.control}
          name="areaId"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange} required>
              <SelectTrigger id="areaId">
                <SelectValue placeholder={areasLoading ? 'Carregando...' : 'Selecione uma área'} />
              </SelectTrigger>
              <SelectContent>
                {areasLoading ? (
                  <SelectItem value="loading" disabled>Carregando áreas...</SelectItem>
                ) : areas.length === 0 ? (
                  <SelectItem value="empty" disabled>Nenhuma área disponível</SelectItem>
                ) : (
                  areas.map((area) => (
                    <SelectItem key={area.id} value={area.id}>
                      {area.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        />
        {form.formState.errors.areaId && (
          <p className="text-sm text-destructive">{form.formState.errors.areaId.message as string}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="eventDate">Data do evento</Label>
        <Input
          id="eventDate"
          type="date"
          {...form.register('eventDate')}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="location">Local</Label>
        <Input
          id="location"
          {...form.register('location')}
          placeholder="Endereço do evento"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="vacancies">Vagas</Label>
        <Input
          id="vacancies"
          type="number"
          min={0}
          {...form.register('vacancies', { valueAsNumber: true })}
          placeholder="Número de vagas"
        />
      </div>

      <Controller
        control={form.control}
        name="description"
        render={({ field }) => (
          <DescriptionField value={field.value ?? ''} onChange={field.onChange} rows={3} />
        )}
      />

      <div className="flex flex-col gap-2">
        <Label htmlFor="content">Conteúdo</Label>
        <Textarea
          id="content"
          {...form.register('content')}
          rows={5}
        />
      </div>

      <Controller
        control={form.control}
        name="coverMediaId"
        render={({ field }) => (
          <ImageUploadField
            mediaId={field.value ?? ''}
            url={projectData?.coverMedia?.url ?? null}
            onChange={(mediaId) => field.onChange(mediaId)}
            onRemove={() => field.onChange('')}
            label="Imagem de capa"
          />
        )}
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="featured"
          {...form.register('featured')}
        />
        <Label htmlFor="featured">Projeto em destaque</Label>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Adicionar projeto'}
        </Button>
      </div>
    </form>
  )
}
