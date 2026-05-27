'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createPostSchema, updatePostSchema } from '@/schemas/post.schema'
import { nowISO } from '@/lib/utils-date'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { usePostMutations, postQueryOptions } from '@/hooks/posts/queries'
import { useQuery } from '@tanstack/react-query'
import { toSlug } from '@/lib/utils'
import { TitleField } from './fields/title-field'
import { SlugField } from './fields/slug-field'

type PostFormProps = {
  postId?: string
  onSuccess: () => void
  onCancel: () => void
}

export function PostForm({ postId, onSuccess, onCancel }: PostFormProps) {
  const isEditing = !!postId
  const { data: postData } = useQuery(postQueryOptions(postId))
  const { create, update, isPending } = usePostMutations()

  const form = useForm({
    resolver: zodResolver(isEditing ? updatePostSchema : createPostSchema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      coverUrl: '',
      author: '',
    },
  })

  useEffect(() => {
    if (!postData) return
    form.reset({
      title: postData.title ?? '',
      slug: postData.slug ?? '',
      excerpt: postData.excerpt ?? '',
      content: postData.content ?? '',
      coverUrl: postData.coverUrl ?? '',
      author: postData.author ?? '',
    })
  }, [postData, form])

  function handleSubmit(data: Record<string, unknown>) {
    const payload = { ...data, publishedAt: nowISO() }
    if (isEditing && postId) {
      update.mutate({ id: postId, data: payload }, { onSuccess })
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
          <SlugField value={field.value ?? ''} onChange={field.onChange} previewUrl="blog" />
        )}
      />

      <div className="flex flex-col gap-2">
        <Label htmlFor="author">Autor</Label>
        <Input id="author" {...form.register('author')} placeholder="Nome do autor" />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="excerpt">Resumo</Label>
        <Textarea id="excerpt" {...form.register('excerpt')} rows={2} placeholder="Breve descrição do post" />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="content">Conteúdo</Label>
        <Textarea id="content" {...form.register('content')} rows={8} placeholder="Conteúdo do post..." />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="coverUrl">URL da imagem de capa</Label>
        <Input id="coverUrl" {...form.register('coverUrl')} placeholder="https://..." />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Criar post'}
        </Button>
      </div>
    </form>
  )
}
