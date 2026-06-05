'use client'

import { useForm, type FieldErrors } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useFiscalNoteMutations } from '@/hooks/fiscal-notes/queries'
import { createFiscalNoteSchema } from '@/schemas/fiscal-note.schema'

function getError(errors: FieldErrors, field: string) {
  return (errors as Record<string, { message?: string } | undefined>)[field]
}

type FiscalNoteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FiscalNoteDialog({ open, onOpenChange }: FiscalNoteDialogProps) {
  const { create: createSubmission, isPending: fiscalSubmitting } = useFiscalNoteMutations()

  const fiscalForm = useForm({
    resolver: zodResolver(createFiscalNoteSchema),
    defaultValues: {
      type: 'ACCESS_KEY' as const,
      accessKey: '',
    },
  })

  const fiscalType = fiscalForm.watch('type')
  const errors = fiscalForm.formState.errors

  function handleFiscalSubmit(data: Record<string, unknown>) {
    const payload: Record<string, unknown> = { type: data.type }
    if (data.type === 'DETAILED') {
      Object.assign(payload, {
        cnpj: data.cnpj,
        emissionDate: data.emissionDate || undefined,
        coo: data.coo,
        amount: Number(data.amount),
      })
    } else {
      Object.assign(payload, { accessKey: data.accessKey })
    }
    createSubmission.mutate(payload, {
      onSuccess: () => {
        onOpenChange(false)
        fiscalForm.reset({ type: 'ACCESS_KEY' as const, accessKey: '' })
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enviar Nota Fiscal</DialogTitle>
        </DialogHeader>
        <form onSubmit={fiscalForm.handleSubmit(handleFiscalSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fiscal-type">Tipo</Label>
            <Select
              value={fiscalType}
              onValueChange={(v: 'DETAILED' | 'ACCESS_KEY') => fiscalForm.setValue('type', v)}
            >
              <SelectTrigger id="fiscal-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DETAILED">Nota Fiscal Detalhada</SelectItem>
                <SelectItem value="ACCESS_KEY">Chave de Acesso</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {fiscalType === 'ACCESS_KEY' && (
            <div className="space-y-2">
              <Label htmlFor="accessKey">Chave de Acesso (44 dígitos)</Label>
              <Input
                id="accessKey"
                {...fiscalForm.register('accessKey')}
                placeholder="0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000"
                maxLength={44}
              />
              {getError(errors, 'accessKey') && (
                <p className="text-sm text-destructive">{getError(errors, 'accessKey')!.message}</p>
              )}
            </div>
          )}

          {fiscalType === 'DETAILED' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input id="cnpj" {...fiscalForm.register('cnpj')} placeholder="00.000.000/0000-00" />
                {getError(errors, 'cnpj') && (
                  <p className="text-sm text-destructive">{getError(errors, 'cnpj')!.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="coo">COO</Label>
                <Input id="coo" {...fiscalForm.register('coo')} placeholder="Número do COO" />
                {getError(errors, 'coo') && (
                  <p className="text-sm text-destructive">{getError(errors, 'coo')!.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Valor (R$)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  {...fiscalForm.register('amount', { valueAsNumber: true })}
                  placeholder="0,00"
                />
                {getError(errors, 'amount') && (
                  <p className="text-sm text-destructive">{getError(errors, 'amount')!.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="emissionDate">Data de Emissão (opcional)</Label>
                <Input id="emissionDate" type="date" {...fiscalForm.register('emissionDate')} />
              </div>
            </>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={fiscalSubmitting}>
              {fiscalSubmitting ? 'Enviando...' : 'Enviar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
