'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createAnimalAgeRangeSchema, updateAnimalAgeRangeSchema } from '@/schemas/animal-age-range.schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAnimalAgeRangeMutations, useAnimalAgeRangeById } from '@/hooks/animal-age-ranges/queries'

type AnimalAgeRangeFormProps = {
  rangeId?: string
  onSuccess: () => void
  onCancel: () => void
}

export function AnimalAgeRangeForm({ rangeId, onSuccess, onCancel }: AnimalAgeRangeFormProps) {
  const isEditing = !!rangeId
  const { data: range } = useAnimalAgeRangeById(rangeId ?? '')
  const { create, update, isPending } = useAnimalAgeRangeMutations()

  const form = useForm({
    resolver: zodResolver(isEditing ? updateAnimalAgeRangeSchema : createAnimalAgeRangeSchema),
    defaultValues: { label: '', minAge: null, maxAge: null, order: 0 },
  })

  useEffect(() => {
    if (!range) return
    form.reset({
      label: range.label ?? '',
      minAge: range.minAge ?? null,
      maxAge: range.maxAge ?? null,
      order: range.order ?? 0,
    })
  }, [range, form])

  function handleSubmit(data: Record<string, unknown>) {
    const payload = {
      label: data.label as string,
      order: Number(data.order) || 0,
      minAge: data.minAge ? Number(data.minAge) : null,
      maxAge: data.maxAge ? Number(data.maxAge) : null,
    }
    if (isEditing && rangeId) {
      update.mutate({ id: rangeId, data: payload }, { onSuccess })
    } else {
      create.mutate(payload, { onSuccess })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="label">Nome da faixa etária</Label>
        <Input id="label" {...form.register('label')} required placeholder="Ex: Filhote, Adulto" />
        {form.formState.errors.label && (
          <p className="text-sm text-destructive">{form.formState.errors.label.message as string}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="minAge">Idade mínima (meses)</Label>
          <Input id="minAge" type="number" {...form.register('minAge', { setValueAs: (v) => (v === '' || v === null ? null : Number(v)) })} placeholder="0" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="maxAge">Idade máxima (meses)</Label>
          <Input id="maxAge" type="number" {...form.register('maxAge', { setValueAs: (v) => (v === '' || v === null ? null : Number(v)) })} placeholder="120" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="order">Ordem</Label>
        <Input id="order" type="number" {...form.register('order', { valueAsNumber: true })} placeholder="0" />
      </div>
      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancelar</Button>
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Adicionar faixa etária'}
        </Button>
      </div>
    </form>
  )
}
