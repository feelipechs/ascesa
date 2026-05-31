'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createPostSchema, updatePostSchema } from '@/schemas/post.schema'
import { nowISO } from '@/lib/utils-date'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { usePostMutations, postQueryOptions } from '@/hooks/posts/queries'
import { useQuery } from '@tanstack/react-query'
import { toSlug } from '@/lib/utils'
import { TitleField } from './fields/title-field'
import { SlugField } from './fields/slug-field'
import { ImageUploadField } from './fields/image-upload-field'
import { RichTextEditor } from '@/components/rich-text-editor/rich-text-editor'

type PostFormProps = {
  postId?: string
  onSuccess?: () => void
  onCancel?: () => void
  mode?: 'sheet' | 'page'
}

export function PostForm({ postId, onSuccess, onCancel, mode = 'sheet' }: PostFormProps) {
  const router = useRouter()
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
    const callback = onSuccess ?? (() => router.push('/blog'))
    if (isEditing && postId) {
      update.mutate({ id: postId, data: payload }, { onSuccess: callback })
    } else {
      create.mutate(payload, { onSuccess: callback })
    }
  }

  function handleCancel() {
    if (onCancel) {
      onCancel()
    } else {
      router.push('/blog')
    }
  }

  return (
    <div className={mode === 'page' ? 'mx-auto max-w-4xl px-4 lg:px-6 space-y-6' : undefined}>
      {mode === 'page' && (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{isEditing ? 'Editar post' : 'Novo post'}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )}

      {mode === 'page' && (
        <h1 className="text-2xl font-semibold">
          {isEditing ? 'Editar post' : 'Novo post'}
        </h1>
      )}

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
            <SlugField
              value={field.value ?? ''}
              onChange={field.onChange}
              previewUrl="blog"
            />
          )}
        />

        <div className="flex flex-col gap-2">
          <Label htmlFor="author">Autor</Label>
          <Input id="author" {...form.register('author')} placeholder="Nome do autor" />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="excerpt">Resumo</Label>
          <Textarea
            id="excerpt"
            {...form.register('excerpt')}
            rows={2}
            placeholder="Breve descrição do post"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Conteúdo</Label>
          <Controller
            control={form.control}
            name="content"
            render={({ field }) => (
              <RichTextEditor
                content={field.value ?? ''}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        <Controller
          control={form.control}
          name="coverUrl"
          render={({ field }) => (
            <ImageUploadField
              value={field.value ?? ''}
              onChange={field.onChange}
              label="Imagem de capa"
            />
          )}
        />

        <div className="flex gap-2 pt-2">
          <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending} className="flex-1">
            {isPending ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Adicionar post'}
          </Button>
        </div>
      </form>
    </div>
  )
}
