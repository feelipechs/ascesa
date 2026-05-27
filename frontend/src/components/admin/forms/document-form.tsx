'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createDocumentSchema, updateDocumentSchema } from '@/schemas/document.schema'
import { nowISO } from '@/lib/utils-date'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDocumentMutations, documentQueryOptions } from '@/hooks/documents/queries'
import { useDocumentCategories } from '@/hooks/document-categories/queries'
import { useQuery } from '@tanstack/react-query'
import { TitleField } from './fields/title-field'
import { DescriptionField } from './fields/description-field'

type DocumentFormProps = {
  documentId?: string
  defaultCategoryId?: string
  onSuccess: () => void
  onCancel: () => void
}

export function DocumentForm({ documentId, defaultCategoryId, onSuccess, onCancel }: DocumentFormProps) {
  const isEditing = !!documentId
  const { data: documentData } = useQuery(documentQueryOptions(documentId))
  const { data: categories, isLoading: categoriesLoading } = useDocumentCategories()
  const { create, update, isPending } = useDocumentMutations()

  const form = useForm({
    resolver: zodResolver(isEditing ? updateDocumentSchema : createDocumentSchema),
    defaultValues: {
      title: '',
      description: '',
      fileUrl: '',
      year: undefined,
      categoryId: defaultCategoryId ?? '',
    },
  })

  useEffect(() => {
    if (!documentData) return
    form.reset({
      title: documentData.title ?? '',
      description: documentData.description ?? '',
      fileUrl: documentData.fileUrl ?? '',
      year: documentData.year ? String(documentData.year) : undefined,
      categoryId: documentData.categoryId ?? '',
    })
  }, [documentData, form])

  function handleSubmit(data: Record<string, unknown>) {
    const payload = {
      ...data,
      year: data.year ? Number(data.year) : undefined,
      categoryId: data.categoryId || defaultCategoryId || '',
      publishedAt: nowISO(),
    }
    if (isEditing && documentId) {
      update.mutate({ id: documentId, data: payload }, { onSuccess })
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
          <TitleField value={field.value ?? ''} onChange={field.onChange} />
        )}
      />

      {defaultCategoryId && !isEditing ? (
        <p className="text-sm text-muted-foreground">
          Categoria: <span className="font-medium text-foreground">{categories?.find((c) => c.id === defaultCategoryId)?.name}</span>
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          <Label htmlFor="categoryId">Categoria</Label>
          <Controller
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange} required>
                <SelectTrigger id="categoryId">
                  <SelectValue placeholder={categoriesLoading ? 'Carregando...' : 'Selecione uma categoria'} />
                </SelectTrigger>
                <SelectContent>
                  {categoriesLoading ? (
                    <SelectItem value="loading" disabled>Carregando categorias...</SelectItem>
                  ) : !categories || categories.length === 0 ? (
                    <SelectItem value="empty" disabled>Nenhuma categoria disponível</SelectItem>
                  ) : (
                    categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name} ({cat._count.documents})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          />
          {form.formState.errors.categoryId && (
            <p className="text-sm text-destructive">{form.formState.errors.categoryId.message as string}</p>
          )}
        </div>
      )}

      <Controller
        control={form.control}
        name="description"
        render={({ field }) => (
          <DescriptionField value={field.value ?? ''} onChange={field.onChange} rows={3} />
        )}
      />

      <div className="flex flex-col gap-2">
        <Label htmlFor="fileUrl">URL do arquivo</Label>
        <Input
          id="fileUrl"
          {...form.register('fileUrl')}
          placeholder="https://..."
          required
        />
        {form.formState.errors.fileUrl && (
          <p className="text-sm text-destructive">{form.formState.errors.fileUrl.message as string}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="year">Ano</Label>
        <Input
          id="year"
          type="number"
          {...form.register('year')}
          placeholder="2024"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Criar documento'}
        </Button>
      </div>
    </form>
  )
}
