'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createAnimalSizeSchema, updateAnimalSizeSchema } from '@/schemas/animal-size.schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAnimalSizeMutations, useAnimalSizeById } from '@/hooks/animal-sizes/queries'

type AnimalSizeFormProps = {
  sizeId?: string
  onSuccess: () => void
  onCancel: () => void
}

export function AnimalSizeForm({ sizeId, onSuccess, onCancel }: AnimalSizeFormProps) {
  const isEditing = !!sizeId
  const { data: size } = useAnimalSizeById(sizeId ?? '')
  const { create, update, isPending } = useAnimalSizeMutations()

  const form = useForm({
    resolver: zodResolver(isEditing ? updateAnimalSizeSchema : createAnimalSizeSchema),
    defaultValues: { label: '', description: '', order: 0 },
  })

  useEffect(() => {
    if (!size) return
    form.reset({ label: size.label ?? '', description: size.description ?? '', order: size.order ?? 0 })
  }, [size, form])

  function handleSubmit(data: Record<string, unknown>) {
    const payload = {
      ...data,
      order: Number(data.order) || 0,
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
      <div className="flex flex-col gap-2">
        <Label htmlFor="order">Ordem</Label>
        <Input id="order" type="number" {...form.register('order', { valueAsNumber: true })} placeholder="0" />
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
