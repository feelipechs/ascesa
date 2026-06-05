'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createGalleryImageSchema, updateGalleryImageSchema } from '@/schemas/gallery-image.schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useGalleryImageMutations, galleryImageQueryOptions } from '@/hooks/gallery-images/queries'
import { useQuery } from '@tanstack/react-query'
import type { GalleryContext } from '@/generated/prisma/enums'
import { ImageUploadField } from './fields/image-upload-field'

type GalleryImageFormProps = {
  context: GalleryContext
  projectId?: string | null
  animalId?: string | null
  imageId?: string
  onSuccess: () => void
  onCancel: () => void
}

export function GalleryImageForm({ context, projectId, animalId, imageId, onSuccess, onCancel }: GalleryImageFormProps) {
  const isEditing = !!imageId
  const { data: imageData } = useQuery(galleryImageQueryOptions(imageId))
  const { create, update, isPending } = useGalleryImageMutations()

  const form = useForm({
    resolver: zodResolver(isEditing ? updateGalleryImageSchema : createGalleryImageSchema),
    defaultValues: {
      mediaId: '',
      caption: '',
      context: context,
      projectId: projectId ?? null,
      animalId: animalId ?? null,
    },
  })

  useEffect(() => {
    if (!imageData) return
    const data = imageData
    form.reset({
      mediaId: data.mediaId ?? '',
      caption: data.caption ?? '',
      context: imageData.context ?? context,
      projectId: imageData.projectId ?? projectId ?? null,
      animalId: imageData.animalId ?? animalId ?? null,
    })
  }, [imageData, form, context, projectId, animalId])

  function handleSubmit(data: Record<string, unknown>) {
    const payload = { ...data, caption: (data.caption as string) || undefined }
    if (isEditing && imageId) {
      update.mutate({ id: imageId, data: payload }, { onSuccess })
    } else {
      create.mutate(payload, { onSuccess })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
      <Controller
        control={form.control}
        name="mediaId"
        render={({ field }) => (
          <ImageUploadField
            mediaId={field.value ?? ''}
            url={imageData?.media?.url ?? null}
            onChange={(mediaId) => field.onChange(mediaId)}
            onRemove={() => field.onChange('')}
            label="Imagem"
          />
        )}
      />

      <div className="flex flex-col gap-2">
        <Label htmlFor="caption">Legenda</Label>
        <Input id="caption" {...form.register('caption')} placeholder="Descrição da imagem" />
      </div>

      <input type="hidden" {...form.register('context')} />
      <input type="hidden" {...form.register('projectId')} />
      <input type="hidden" {...form.register('animalId')} />

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancelar</Button>
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Adicionar imagem'}
        </Button>
      </div>
    </form>
  )
}
