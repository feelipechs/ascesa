'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createGalleryImageSchema, updateGalleryImageSchema } from '@/schemas/gallery-image.schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useGalleryImageMutations, galleryImageQueryOptions } from '@/hooks/gallery-images/queries'
import { useQuery } from '@tanstack/react-query'
import type { GalleryContext } from '@/generated/prisma/enums'

type GalleryImageFormProps = {
  context: GalleryContext
  projectId?: string | null
  imageId?: string
  onSuccess: () => void
  onCancel: () => void
}

export function GalleryImageForm({ context, projectId, imageId, onSuccess, onCancel }: GalleryImageFormProps) {
  const isEditing = !!imageId
  const { data: imageData } = useQuery(galleryImageQueryOptions(imageId))
  const { create, update, isPending } = useGalleryImageMutations()

  const form = useForm({
    resolver: zodResolver(isEditing ? updateGalleryImageSchema : createGalleryImageSchema),
    defaultValues: {
      url: '',
      caption: '',
      order: 0,
      context: context,
      projectId: projectId ?? null,
    },
  })

  useEffect(() => {
    if (!imageData) return
    form.reset({
      url: imageData.url ?? '',
      caption: imageData.caption ?? '',
      order: imageData.order ?? 0,
      context: imageData.context ?? context,
      projectId: imageData.projectId ?? projectId ?? null,
    })
  }, [imageData, form, context, projectId])

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
      <div className="flex flex-col gap-2">
        <Label htmlFor="url">URL da imagem</Label>
        <Input id="url" {...form.register('url')} required placeholder="https://..." />
        {form.formState.errors.url && (
          <p className="text-sm text-destructive">{form.formState.errors.url.message as string}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="caption">Legenda</Label>
        <Input id="caption" {...form.register('caption')} placeholder="Descrição da imagem" />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="order">Ordem</Label>
        <Input id="order" type="number" {...form.register('order')} />
      </div>

      <input type="hidden" {...form.register('context')} />
      <input type="hidden" {...form.register('projectId')} />

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancelar</Button>
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Adicionar imagem'}
        </Button>
      </div>
    </form>
  )
}
