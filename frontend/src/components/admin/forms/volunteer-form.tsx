'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createVolunteerSchema, updateVolunteerSchema } from '@/schemas/volunteer.schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MaskInput } from '@/components/ui/mask-input'
import { useVolunteerMutations, volunteerQueryOptions } from '@/hooks/volunteers/queries'
import { useQuery } from '@tanstack/react-query'
import { brPhoneMask } from '@/lib/mask-patterns'
import { Skeleton } from '@/components/ui/skeleton'
import type { VolunteerWithRegistrations } from '@/types'

type VolunteerFormProps = {
  volunteerId?: string
  onSuccess: () => void
  onCancel: () => void
}

export function VolunteerForm({ volunteerId, onSuccess, onCancel }: VolunteerFormProps) {
  const isEditing = !!volunteerId
  const { data: volunteerData, isLoading } = useQuery(volunteerQueryOptions(volunteerId))
  const { create, update, isPending } = useVolunteerMutations()

  if (isEditing && isLoading) return <Skeleton className="h-96 w-full" />
  if (isEditing && !volunteerData) return null

  return (
    <VolunteerFormInner
      volunteerId={volunteerId}
      isEditing={isEditing}
      volunteerData={volunteerData}
      isPending={isPending}
      create={create}
      update={update}
      onSuccess={onSuccess}
      onCancel={onCancel}
    />
  )
}

type VolunteerFormInnerProps = {
  volunteerId?: string
  isEditing: boolean
  volunteerData?: VolunteerWithRegistrations
  isPending: boolean
  create: ReturnType<typeof useVolunteerMutations>['create']
  update: ReturnType<typeof useVolunteerMutations>['update']
  onSuccess: () => void
  onCancel: () => void
}

function VolunteerFormInner({
  volunteerId,
  isEditing,
  volunteerData,
  isPending,
  create,
  update,
  onSuccess,
  onCancel,
}: VolunteerFormInnerProps) {
  const form = useForm({
    resolver: zodResolver(isEditing ? updateVolunteerSchema : createVolunteerSchema),
    defaultValues: {
      name: volunteerData?.name ?? '',
      email: volunteerData?.email ?? '',
      phone: volunteerData?.phone ?? '',
    },
  })

  function handleSubmit(data: Record<string, unknown>) {
    if (isEditing && volunteerId) {
      update.mutate({ id: volunteerId, data }, { onSuccess })
    } else {
      create.mutate(data, { onSuccess })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Nome *</Label>
        <Input id="name" {...form.register('name')} placeholder="Nome completo" />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive">{form.formState.errors.name.message as string}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email *</Label>
        <Input id="email" type="email" {...form.register('email')} placeholder="email@exemplo.com" />
        {form.formState.errors.email && (
          <p className="text-sm text-destructive">{form.formState.errors.email.message as string}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="phone">Telefone</Label>
        <Controller
          name="phone"
          control={form.control}
          render={({ field }) => (
            <MaskInput
              id="phone"
              mask={brPhoneMask}
              value={field.value}
              onValueChange={(_masked, unmasked) => field.onChange(unmasked)}
            />
          )}
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Adicionar voluntário'}
        </Button>
      </div>
    </form>
  )
}
