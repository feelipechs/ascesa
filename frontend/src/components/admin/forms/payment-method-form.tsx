'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createPaymentMethodSchema, updatePaymentMethodSchema } from '@/schemas/payment-method.schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePaymentMethodMutations } from '@/hooks/payment-methods/queries'

type PaymentMethodFormProps = {
  method?: Record<string, unknown>
  onSuccess: () => void
  onCancel: () => void
}

export function PaymentMethodForm({ method, onSuccess, onCancel }: PaymentMethodFormProps) {
  const isEditing = !!method
  const { create, update, isPending } = usePaymentMethodMutations()
  const [type, setType] = useState<string>((method?.type as string) ?? 'PIX')

  const form = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(isEditing ? updatePaymentMethodSchema : createPaymentMethodSchema) as any,
    defaultValues: {
      type: 'PIX',
      label: '',
      instructions: '',
      order: 0,
      key: '',
      receiverName: '',
      receiverCity: '',
      bankName: '',
      agency: '',
      account: '',
      accountType: '',
    },
  })

  useEffect(() => {
    if (!method) return
    setType((method.type as string) ?? 'PIX')
    form.reset({
      type: (method.type as 'PIX' | 'BANK_TRANSFER' | 'CASH') ?? 'PIX',
      label: (method.label as string) ?? '',
      instructions: (method.instructions as string) ?? '',
      order: (method.order as number) ?? 0,
      key: (method.pixConfig as Record<string, unknown> | null)?.key as string ?? '',
      receiverName: (method.pixConfig as Record<string, unknown> | null)?.receiverName as string ?? '',
      receiverCity: (method.pixConfig as Record<string, unknown> | null)?.receiverCity as string ?? '',
      bankName: (method.bankConfig as Record<string, unknown> | null)?.bankName as string ?? '',
      agency: (method.bankConfig as Record<string, unknown> | null)?.agency as string ?? '',
      account: (method.bankConfig as Record<string, unknown> | null)?.account as string ?? '',
      accountType: (method.bankConfig as Record<string, unknown> | null)?.accountType as string ?? '',
    })
  }, [method, form])

  function handleSubmit(data: Record<string, unknown>) {
    const payload: Record<string, unknown> = {
      type,
      label: data.label as string,
      instructions: (data.instructions as string) || null,
      order: Number(data.order) || 0,
    }
    if (type === 'PIX') {
      payload.key = data.key
      payload.receiverName = data.receiverName
      payload.receiverCity = data.receiverCity
    } else if (type === 'BANK_TRANSFER') {
      payload.bankName = data.bankName
      payload.agency = data.agency
      payload.account = data.account
      payload.accountType = (data.accountType as string) || null
    }
    if (isEditing && method) {
      update.mutate({ id: method.id as string, data: payload }, { onSuccess })
    } else {
      create.mutate(payload, { onSuccess })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="type">Tipo</Label>
        <Select value={type} onValueChange={(v) => { setType(v); form.setValue('type', v as 'PIX' | 'BANK_TRANSFER' | 'CASH') }}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="PIX">PIX</SelectItem>
            <SelectItem value="BANK_TRANSFER">Transferência Bancária</SelectItem>
            <SelectItem value="CASH">Dinheiro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="label">Label</Label>
        <Input id="label" {...form.register('label')} required placeholder="Ex: PIX — CNPJ" />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="instructions">Instruções (opcional)</Label>
        <Textarea id="instructions" {...form.register('instructions')} placeholder="Orientação ao doador" rows={2} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="order">Ordem</Label>
          <Input id="order" type="number" {...form.register('order', { valueAsNumber: true })} placeholder="0" />
        </div>
      </div>

      {type === 'PIX' && (
        <>
          <div className="flex flex-col gap-2">
            <Label htmlFor="key">Chave PIX</Label>
            <Input id="key" {...form.register('key')} required placeholder="CNPJ, CPF, email ou telefone" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="receiverName">Nome do recebedor</Label>
              <Input id="receiverName" {...form.register('receiverName')} required placeholder="Nome completo" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="receiverCity">Cidade</Label>
              <Input id="receiverCity" {...form.register('receiverCity')} required placeholder="São Paulo" />
            </div>
          </div>
        </>
      )}

      {type === 'BANK_TRANSFER' && (
        <>
          <div className="flex flex-col gap-2">
            <Label htmlFor="bankName">Banco</Label>
            <Input id="bankName" {...form.register('bankName')} required placeholder="Ex: Banco do Brasil" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="agency">Agência</Label>
              <Input id="agency" {...form.register('agency')} required placeholder="0000" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="account">Conta</Label>
              <Input id="account" {...form.register('account')} required placeholder="00000-0" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="accountType">Tipo de conta (opcional)</Label>
            <Input id="accountType" {...form.register('accountType')} placeholder="Corrente / Poupança" />
          </div>
        </>
      )}

      {type === 'CASH' && (
        <p className="text-sm text-muted-foreground">Dinheiro: redireciona para o WhatsApp da ONG.</p>
      )}

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancelar</Button>
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Adicionar método'}
        </Button>
      </div>
    </form>
  )
}
