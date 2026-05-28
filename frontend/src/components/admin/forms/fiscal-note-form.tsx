'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFiscalNoteSchema } from '@/schemas/fiscal-note.schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useFiscalNoteMutations } from '@/hooks/fiscal-notes/queries'

type FiscalNoteFormProps = {
  note?: Record<string, unknown>
  onSuccess: () => void
  onCancel: () => void
}

export function FiscalNoteForm({ note, onSuccess, onCancel }: FiscalNoteFormProps) {
  const isEditing = !!note
  const { create, update, isPending } = useFiscalNoteMutations()
  const [type, setType] = useState<string>((note?.type as string) ?? 'ACCESS_KEY')

  const form = useForm<any>({
    resolver: zodResolver(createFiscalNoteSchema),
    defaultValues: {
      type: 'ACCESS_KEY',
      cnpj: '',
      emissionDate: '',
      coo: '',
      amount: 0,
      accessKey: '',
    },
  })

  useEffect(() => {
    if (!note) return
    setType((note.type as string) ?? 'ACCESS_KEY')
    form.reset({
      type: (note.type as 'DETAILED' | 'ACCESS_KEY') ?? 'ACCESS_KEY',
      cnpj: (note.cnpj as string) ?? '',
      emissionDate: note.emissionDate ? new Date(note.emissionDate as string).toISOString().split('T')[0] : '',
      coo: (note.coo as string) ?? '',
      amount: (note.amount as number) ?? 0,
      accessKey: (note.accessKey as string) ?? '',
    })
  }, [note, form])

  function handleSubmit(data: Record<string, unknown>) {
    const payload: Record<string, unknown> = { type }
    if (type === 'DETAILED') {
      payload.cnpj = data.cnpj
      payload.emissionDate = data.emissionDate ? new Date(data.emissionDate as string).toISOString() : null
      payload.coo = data.coo
      payload.amount = Number(data.amount)
    } else {
      payload.accessKey = data.accessKey
    }
    if (isEditing && note) {
      update.mutate({ id: note.id as string, data: payload }, { onSuccess })
    } else {
      create.mutate(payload, { onSuccess })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="type">Tipo</Label>
        <Select value={type} onValueChange={(v) => { setType(v); form.setValue('type', v as 'DETAILED' | 'ACCESS_KEY') }}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="DETAILED">Nota Detalhada</SelectItem>
            <SelectItem value="ACCESS_KEY">Chave de Acesso</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {type === 'DETAILED' && (
        <>
          <div className="flex flex-col gap-2">
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input id="cnpj" {...form.register('cnpj')} required placeholder="00.000.000/0000-00" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="emissionDate">Data de emissão</Label>
            <Input id="emissionDate" type="date" {...form.register('emissionDate')} required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="coo">COO</Label>
            <Input id="coo" {...form.register('coo')} required placeholder="Número do COO" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="amount">Valor (R$)</Label>
            <Input id="amount" type="number" step="0.01" {...form.register('amount', { valueAsNumber: true })} required placeholder="0,00" />
          </div>
        </>
      )}

      {type === 'ACCESS_KEY' && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="accessKey">Chave de acesso (44 dígitos)</Label>
          <Input id="accessKey" {...form.register('accessKey')} required placeholder="0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000" maxLength={44} />
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
