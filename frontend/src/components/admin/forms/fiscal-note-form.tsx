'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFiscalNoteSchema } from '@/schemas/fiscal-note.schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useFiscalNoteMutations } from '@/hooks/fiscal-notes/queries'
import type { FiscalNote } from '@/types'
import type { FieldErrors } from 'react-hook-form'
import { toDateInput } from '@/lib/utils-date'

type FiscalNoteFormProps = {
  note?: FiscalNote
  onSuccess: () => void
  onCancel: () => void
}

function getError(errors: FieldErrors, field: string) {
  return (errors as Record<string, { message?: string } | undefined>)[field]
}

export function FiscalNoteForm({ note, onSuccess, onCancel }: FiscalNoteFormProps) {
  const isEditing = !!note
  const { create, update, isPending } = useFiscalNoteMutations()

  const form = useForm({
    resolver: zodResolver(createFiscalNoteSchema),
    defaultValues: {
      type: 'ACCESS_KEY' as const,
      accessKey: '',
    },
  })

  const watchType = form.watch('type')

  useEffect(() => {
    if (!note) return
    if (note.type === 'DETAILED') {
      form.reset({
        type: 'DETAILED',
        cnpj: note.cnpj ?? '',
        emissionDate: note.emissionDate ? toDateInput(note.emissionDate) : undefined,
        coo: note.coo ?? '',
        amount: note.amount ? Number(note.amount) : 0,
      })
    } else {
      form.reset({
        type: 'ACCESS_KEY',
        accessKey: note.accessKey ?? '',
      })
    }
  }, [note, form])

  const errors = form.formState.errors

  function handleSubmit(data: Record<string, unknown>) {
    const payload = { type: data.type }
    if (data.type === 'DETAILED') {
      Object.assign(payload, {
        cnpj: data.cnpj,
        emissionDate: data.emissionDate || undefined,
        coo: data.coo,
        amount: Number(data.amount),
      })
    } else {
      Object.assign(payload, {
        accessKey: data.accessKey,
      })
    }
    if (isEditing && note) {
      update.mutate({ id: note.id, data: payload }, { onSuccess })
    } else {
      create.mutate(payload, { onSuccess })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="type">Tipo</Label>
        <Select value={watchType} onValueChange={(v: 'DETAILED' | 'ACCESS_KEY') => form.setValue('type', v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="DETAILED">Nota Detalhada</SelectItem>
            <SelectItem value="ACCESS_KEY">Chave de Acesso</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {watchType === 'DETAILED' && (
        <>
          <div className="flex flex-col gap-2">
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input id="cnpj" {...form.register('cnpj')} placeholder="00.000.000/0000-00" />
            {getError(errors, 'cnpj') && (
              <p className="text-sm text-destructive">{getError(errors, 'cnpj')!.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="emissionDate">Data de emissão</Label>
            <Input id="emissionDate" type="date" {...form.register('emissionDate')} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="coo">COO</Label>
            <Input id="coo" {...form.register('coo')} placeholder="Número do COO" />
            {getError(errors, 'coo') && (
              <p className="text-sm text-destructive">{getError(errors, 'coo')!.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="amount">Valor (R$)</Label>
              <Input id="amount" type="number" step="0.01" {...form.register('amount', { valueAsNumber: true })} placeholder="0,00" />
            {getError(errors, 'amount') && (
              <p className="text-sm text-destructive">{getError(errors, 'amount')!.message}</p>
            )}
          </div>
        </>
      )}

      {watchType === 'ACCESS_KEY' && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="accessKey">Chave de acesso (44 dígitos)</Label>
            <Input id="accessKey" {...form.register('accessKey')} placeholder="0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000" maxLength={44} />
          {getError(errors, 'accessKey') && (
            <p className="text-sm text-destructive">{getError(errors, 'accessKey')!.message}</p>
          )}
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancelar</Button>
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Adicionar nota fiscal'}
        </Button>
      </div>
    </form>
  )
}
