'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createPartnerSchema, updatePartnerSchema } from '@/schemas/partner.schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { usePartnerMutations, partnerQueryOptions } from '@/hooks/partners/queries'
import { useQuery } from '@tanstack/react-query'

type PartnerFormProps = {
  partnerId?: string
  onSuccess: () => void
  onCancel: () => void
}

export function PartnerForm({ partnerId, onSuccess, onCancel }: PartnerFormProps) {
  const isEditing = !!partnerId
  const { data: partnerData } = useQuery(partnerQueryOptions(partnerId))
  const { create, update, isPending } = usePartnerMutations()

  const form = useForm({
    resolver: zodResolver(isEditing ? updatePartnerSchema : createPartnerSchema),
    defaultValues: {
      name: '',
      logoUrl: '',
      websiteUrl: '',
    },
  })

  useEffect(() => {
    if (!partnerData) return
    form.reset({
      name: partnerData.name ?? '',
      logoUrl: partnerData.logoUrl ?? '',
      websiteUrl: partnerData.websiteUrl ?? '',
    })
  }, [partnerData, form])

  function handleSubmit(data: Record<string, unknown>) {
    const payload = { ...data, websiteUrl: (data.websiteUrl as string) || undefined }
    if (isEditing && partnerId) {
      update.mutate({ id: partnerId, data: payload }, { onSuccess })
    } else {
      create.mutate(payload, { onSuccess })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Nome do parceiro</Label>
        <Input id="name" {...form.register('name')} required placeholder="Nome da instituição" />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive">{form.formState.errors.name.message as string}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="logoUrl">URL da logo</Label>
        <Input id="logoUrl" {...form.register('logoUrl')} required placeholder="https://..." />
        {form.formState.errors.logoUrl && (
          <p className="text-sm text-destructive">{form.formState.errors.logoUrl.message as string}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="websiteUrl">Site (opcional)</Label>
        <Input id="websiteUrl" {...form.register('websiteUrl')} placeholder="https://..." />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancelar</Button>
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Adicionar parceiro'}
        </Button>
      </div>
    </form>
  )
}
