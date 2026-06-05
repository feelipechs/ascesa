'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createTeamMemberSchema, updateTeamMemberSchema } from '@/schemas/team-member.schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useTeamMemberMutations, teamMemberQueryOptions } from '@/hooks/team-members/queries'
import { useQuery } from '@tanstack/react-query'
import { ImageUploadField } from './fields/image-upload-field'


type TeamMemberFormProps = {
  areaIds?: string[]
  memberId?: string
  onSuccess: () => void
  onCancel: () => void
}

export function TeamMemberForm({ areaIds = [], memberId, onSuccess, onCancel }: TeamMemberFormProps) {
  const isEditing = !!memberId
  const { data: memberData } = useQuery(teamMemberQueryOptions(memberId))
  const { create, update, isPending } = useTeamMemberMutations()

  const form = useForm({
    resolver: zodResolver(isEditing ? updateTeamMemberSchema : createTeamMemberSchema),
    defaultValues: {
      name: '',
      role: '',
      bio: '',
      photoMediaId: '',
    },
  })

  useEffect(() => {
    if (!memberData) return
    form.reset({
      name: memberData.name ?? '',
      role: memberData.role ?? '',
      bio: memberData.bio ?? '',
      photoMediaId: memberData.photoMediaId ?? '',
    })
  }, [memberData, form])

  function handleSubmit(data: Record<string, unknown>) {
    const payload = { ...data, bio: (data.bio as string) || undefined, photoMediaId: (data.photoMediaId as string) || null, areaIds }
    if (isEditing && memberId) {
      update.mutate({ id: memberId, data: payload }, { onSuccess })
    } else {
      create.mutate(payload, { onSuccess })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" {...form.register('name')} required placeholder="Nome completo" />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive">{form.formState.errors.name.message as string}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="role">Cargo</Label>
        <Input id="role" {...form.register('role')} required placeholder="Ex: Veterinário" />
        {form.formState.errors.role && (
          <p className="text-sm text-destructive">{form.formState.errors.role.message as string}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="bio">Biografia</Label>
        <Textarea id="bio" {...form.register('bio')} rows={3} placeholder="Breve descrição..." />
      </div>

      <Controller
        control={form.control}
        name="photoMediaId"
        render={({ field }) => (
          <ImageUploadField
            mediaId={field.value ?? ''}
            url={memberData?.photoMedia?.url ?? null}
            onChange={(mediaId) => field.onChange(mediaId)}
            onRemove={() => field.onChange('')}
            label="Foto do membro"
          />
        )}
      />

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancelar</Button>
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Adicionar membro'}
        </Button>
      </div>
    </form>
  )
}
