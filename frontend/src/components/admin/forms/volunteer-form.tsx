'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createVolunteerSchema, updateVolunteerSchema } from '@/schemas/volunteer.schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useVolunteerMutations, volunteerQueryOptions } from '@/hooks/volunteers/queries'
import { useQuery } from '@tanstack/react-query'

type VolunteerFormProps = {
  volunteerId?: string
  onSuccess: () => void
  onCancel: () => void
}

export function VolunteerForm({ volunteerId, onSuccess, onCancel }: VolunteerFormProps) {
  const isEditing = !!volunteerId
  const { data: volunteerData } = useQuery(volunteerQueryOptions(volunteerId))
  const { create, update, isPending } = useVolunteerMutations()

  const form = useForm({
    resolver: zodResolver(isEditing ? updateVolunteerSchema : createVolunteerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      birthDate: '',
    },
  })

  useEffect(() => {
    if (!volunteerData) return
    const data = volunteerData as unknown as Record<string, unknown>
    form.reset({
      name: (data.name as string) ?? '',
      email: (data.email as string) ?? '',
      phone: (data.phone as string) ?? '',
      birthDate: data.birthDate ? String(data.birthDate).split('T')[0] : '',
    })
  }, [volunteerData, form])

  function handleSubmit(data: Record<string, unknown>) {
    const payload = {
      ...data,
      birthDate: data.birthDate ? new Date(data.birthDate as string).toISOString() : null,
    }
    if (isEditing && volunteerId) {
      update.mutate({ id: volunteerId, data: payload }, { onSuccess })
    } else {
      create.mutate(payload, { onSuccess })
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
        <Input id="phone" {...form.register('phone')} placeholder="(11) 99999-9999" />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="birthDate">Data de nascimento</Label>
        <Input id="birthDate" type="date" {...form.register('birthDate')} />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Cadastrar voluntário'}
        </Button>
      </div>
    </form>
  )
}
