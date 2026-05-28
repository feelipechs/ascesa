'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createAnimalSpeciesSchema, updateAnimalSpeciesSchema } from '@/schemas/animal-species.schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAnimalSpeciesMutations, useAnimalSpeciesById } from '@/hooks/animal-species/queries'

type AnimalSpeciesFormProps = {
  speciesId?: string
  onSuccess: () => void
  onCancel: () => void
}

export function AnimalSpeciesForm({ speciesId, onSuccess, onCancel }: AnimalSpeciesFormProps) {
  const isEditing = !!speciesId
  const { data: species } = useAnimalSpeciesById(speciesId ?? '')
  const { create, update, isPending } = useAnimalSpeciesMutations()

  const form = useForm({
    resolver: zodResolver(isEditing ? updateAnimalSpeciesSchema : createAnimalSpeciesSchema),
    defaultValues: { name: '', order: 0 },
  })

  useEffect(() => {
    if (!species) return
    form.reset({ name: species.name ?? '', order: species.order ?? 0 })
  }, [species, form])

  function handleSubmit(data: Record<string, unknown>) {
    const payload = { ...data, order: Number(data.order) || 0 }
    if (isEditing && speciesId) {
      update.mutate({ id: speciesId, data: payload }, { onSuccess })
    } else {
      create.mutate(payload, { onSuccess })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Nome da espécie</Label>
        <Input id="name" {...form.register('name')} required placeholder="Ex: Cão, Gato" />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive">{form.formState.errors.name.message as string}</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="order">Ordem</Label>
        <Input id="order" type="number" {...form.register('order', { valueAsNumber: true })} placeholder="0" />
      </div>
      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancelar</Button>
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Adicionar espécie'}
        </Button>
      </div>
    </form>
  )
}
