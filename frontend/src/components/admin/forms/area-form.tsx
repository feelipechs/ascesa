'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createAreaSchema, updateAreaSchema } from '@/schemas/area.schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAreaMutations, areaQueryOptions } from '@/hooks/areas/queries'
import { useQuery } from '@tanstack/react-query'
import { toSlug } from '@/lib/utils'
import { TitleField } from './fields/title-field'
import { SlugField } from './fields/slug-field'
import { DescriptionField } from './fields/description-field'
import { IconPicker } from './fields/icon-picker'

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
      coverUrl: '',
    },
  })

  useEffect(() => {
    if (!areaData) return
    form.reset({
      title: areaData.title ?? '',
      slug: areaData.slug ?? '',
      description: areaData.description ?? '',
      iconName: areaData.iconName ?? null,
      coverUrl: areaData.coverUrl ?? '',
    })
  }, [areaData, form])

  function handleSubmit(data: Record<string, unknown>) {
    if (isEditing && areaId) {
      update.mutate({ id: areaId, data }, { onSuccess })
    } else {
      create.mutate(data, { onSuccess })
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

      <div className="flex flex-col gap-2">
        <Label htmlFor="coverUrl">URL da imagem de capa</Label>
        <Input
          id="coverUrl"
          {...form.register('coverUrl')}
          placeholder="https://..."
        />
      </div>

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
