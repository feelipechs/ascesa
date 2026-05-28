'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createDocumentCategorySchema, updateDocumentCategorySchema } from '@/schemas/document-category.schema'
import { Button } from '@/components/ui/button'
import { useDocumentCategoryMutations, documentCategoryQueryOptions } from '@/hooks/document-categories/queries'
import { useQuery } from '@tanstack/react-query'
import { toSlug } from '@/lib/utils'
import { TitleField } from './fields/title-field'
import { SlugField } from './fields/slug-field'

type DocumentCategoryFormProps = {
  categoryId?: string
  onSuccess: () => void
  onCancel: () => void
}

export function DocumentCategoryForm({ categoryId, onSuccess, onCancel }: DocumentCategoryFormProps) {
  const isEditing = !!categoryId
  const { data: categoryData } = useQuery(documentCategoryQueryOptions(categoryId))
  const { create, update, isPending } = useDocumentCategoryMutations()

  const form = useForm({
    resolver: zodResolver(isEditing ? updateDocumentCategorySchema : createDocumentCategorySchema),
    defaultValues: {
      name: '',
      slug: '',
    },
  })

  useEffect(() => {
    if (!categoryData) return
    form.reset({
      name: categoryData.name ?? '',
      slug: categoryData.slug ?? '',
    })
  }, [categoryData, form])

  function handleSubmit(data: Record<string, unknown>) {
    if (isEditing && categoryId) {
      update.mutate({ id: categoryId, data }, { onSuccess })
    } else {
      create.mutate(data, { onSuccess })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
      <Controller
        control={form.control}
        name="name"
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
          <SlugField value={field.value ?? ''} onChange={field.onChange} previewUrl="transparencia" />
        )}
      />

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancelar</Button>
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Adicionar categoria'}
        </Button>
      </div>
    </form>
  )
}
