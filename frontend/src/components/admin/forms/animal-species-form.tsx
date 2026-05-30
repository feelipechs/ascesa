'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createAnimalSpeciesSchema, updateAnimalSpeciesSchema } from '@/schemas/animal-species.schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAnimalSpeciesMutations, animalSpeciesByIdQueryOptions } from '@/hooks/animal-species/queries'
import { useQuery } from '@tanstack/react-query'

type AnimalSpeciesFormProps = {
  speciesId?: string
  onSuccess: () => void
  onCancel: () => void
}

export function AnimalSpeciesForm({ speciesId, onSuccess, onCancel }: AnimalSpeciesFormProps) {
  const isEditing = !!speciesId
  const { data: species } = useQuery(animalSpeciesByIdQueryOptions(speciesId))
  const { create, update, isPending } = useAnimalSpeciesMutations()

  const form = useForm({
    resolver: zodResolver(isEditing ? updateAnimalSpeciesSchema : createAnimalSpeciesSchema),
    defaultValues: { name: '' },
  })

  useEffect(() => {
    if (!species) return
    form.reset({ name: species.name ?? '' })
  }, [species, form])

  function handleSubmit(data: Record<string, unknown>) {
    if (isEditing && speciesId) {
      update.mutate({ id: speciesId, data }, { onSuccess })
    } else {
      create.mutate(data, { onSuccess })
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
    <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancelar</Button>
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Adicionar espécie'}
        </Button>
      </div>
    </form>
  )
}
