'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createAreaSchema, updateAreaSchema } from '@/schemas/area.schema'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useAreaMutations, areaQueryOptions } from '@/hooks/areas/queries'
import { useQuery } from '@tanstack/react-query'
import { toSlug } from '@/lib/utils'
import { TitleField } from './fields/title-field'
import { SlugField } from './fields/slug-field'
import { DescriptionField } from './fields/description-field'
import { IconPicker } from './fields/icon-picker'
import { ImageUploadField } from './fields/image-upload-field'


type AreaFormProps = {
  areaId?: string
  onSuccess: () => void
  onCancel: () => void
}

export function AreaForm({ areaId, onSuccess, onCancel }: AreaFormProps) {
  const isEditing = !!areaId
  const { data: areaData } = useQuery(areaQueryOptions(areaId))
  const { create, update, isPending } = useAreaMutations()

  const form = useForm({
    resolver: zodResolver(isEditing ? updateAreaSchema : createAreaSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      iconName: null,
      coverMediaId: '',
    },
  })

  useEffect(() => {
    if (!areaData) return
    form.reset({
      title: areaData.title ?? '',
      slug: areaData.slug ?? '',
      description: areaData.description ?? '',
      iconName: areaData.iconName ?? null,
      coverMediaId: areaData.coverMediaId ?? '',
    })
  }, [areaData, form])

  function handleSubmit(data: Record<string, unknown>) {
    const payload = { ...data, coverMediaId: (data.coverMediaId as string) || null }
    if (isEditing && areaId) {
      update.mutate({ id: areaId, data: payload }, { onSuccess })
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
          <SlugField value={field.value ?? ''} onChange={field.onChange} previewUrl="areas" />
        )}
      />

      <Controller
        control={form.control}
        name="description"
        render={({ field }) => (
          <DescriptionField value={field.value ?? ''} onChange={field.onChange} />
        )}
      />

      <Controller
        control={form.control}
        name="coverMediaId"
        render={({ field }) => (
          <ImageUploadField
            mediaId={field.value ?? ''}
            url={areaData?.coverMedia?.url ?? null}
            onChange={(mediaId) => field.onChange(mediaId)}
            onRemove={() => field.onChange('')}
            label="Imagem de capa"
          />
        )}
      />

      <div className="flex flex-col gap-2">
        <Label>Ícone</Label>
        <Controller
          control={form.control}
          name="iconName"
          render={({ field }) => (
            <IconPicker value={field.value} onChange={field.onChange} />
          )}
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Adicionar área'}
        </Button>
      </div>
    </form>
  )
}
