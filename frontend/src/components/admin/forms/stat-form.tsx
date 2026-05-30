'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createStatSchema, updateStatSchema } from '@/schemas/stat.schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useStatMutations, statQueryOptions } from '@/hooks/stats/queries'
import { useQuery } from '@tanstack/react-query'

type StatFormProps = {
  statId?: string
  onSuccess: () => void
  onCancel: () => void
}

export function StatForm({ statId, onSuccess, onCancel }: StatFormProps) {
  const isEditing = !!statId
  const { data: statData } = useQuery(statQueryOptions(statId))
  const { create, update, isPending } = useStatMutations()

  const form = useForm({
    resolver: zodResolver(isEditing ? updateStatSchema : createStatSchema),
    defaultValues: {
      label: '',
      value: '',
    },
  })

  useEffect(() => {
    if (!statData) return
    form.reset({
      label: statData.label ?? '',
      value: statData.value ?? '',
    })
  }, [statData, form])

  function handleSubmit(data: Record<string, unknown>) {
    if (isEditing && statId) {
      update.mutate({ id: statId, data }, { onSuccess })
    } else {
      create.mutate(data, { onSuccess })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="label">Label *</Label>
        <Input id="label" {...form.register('label')} placeholder="Ex: Animais resgatados" />
        {form.formState.errors.label && (
          <p className="text-sm text-destructive">{form.formState.errors.label.message as string}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="value">Valor *</Label>
        <Input id="value" {...form.register('value')} placeholder="Ex: 1500" />
        {form.formState.errors.value && (
          <p className="text-sm text-destructive">{form.formState.errors.value.message as string}</p>
        )}
      </div>

    <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Adicionar métrica'}
        </Button>
      </div>
    </form>
  )
}
