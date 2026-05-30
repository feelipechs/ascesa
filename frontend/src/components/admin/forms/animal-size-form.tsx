'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createAnimalSizeSchema, updateAnimalSizeSchema } from '@/schemas/animal-size.schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAnimalSizeMutations, animalSizeByIdQueryOptions } from '@/hooks/animal-sizes/queries'
import { useQuery } from '@tanstack/react-query'

type AnimalSizeFormProps = {
  sizeId?: string
  onSuccess: () => void
  onCancel: () => void
}

export function AnimalSizeForm({ sizeId, onSuccess, onCancel }: AnimalSizeFormProps) {
  const isEditing = !!sizeId
  const { data: size } = useQuery(animalSizeByIdQueryOptions(sizeId))
  const { create, update, isPending } = useAnimalSizeMutations()

  const form = useForm({
    resolver: zodResolver(isEditing ? updateAnimalSizeSchema : createAnimalSizeSchema),
    defaultValues: { label: '', description: '' },
  })

  useEffect(() => {
    if (!size) return
    form.reset({ label: size.label ?? '', description: size.description ?? '' })
  }, [size, form])

  function handleSubmit(data: Record<string, unknown>) {
    const payload = {
      ...data,
      description: (data.description as string) || null,
    }
    if (isEditing && sizeId) {
      update.mutate({ id: sizeId, data: payload }, { onSuccess })
    } else {
      create.mutate(payload, { onSuccess })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="label">Nome do porte</Label>
        <Input id="label" {...form.register('label')} required placeholder="Ex: Pequeno, Médio" />
        {form.formState.errors.label && (
          <p className="text-sm text-destructive">{form.formState.errors.label.message as string}</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Descrição (opcional)</Label>
        <Textarea id="description" {...form.register('description')} placeholder="Ex: até 10kg" />
      </div>
    <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancelar</Button>
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Adicionar porte'}
        </Button>
      </div>
    </form>
  )
}
