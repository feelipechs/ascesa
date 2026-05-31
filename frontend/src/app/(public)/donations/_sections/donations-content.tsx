'use client'

import { Syringe, Bone, ClipboardList, FileText, Key, HelpCircle, Plus, Dog } from 'lucide-react'
import { useState } from 'react'
import { useForm, type FieldErrors } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageSection } from '@/components/page-section'
import { SectionHeading } from '@/components/section-heading'
import { useFiscalNoteMutations } from '@/hooks/fiscal-notes/queries'
import { createFiscalNoteSchema } from '@/schemas/fiscal-note.schema'
import { toast } from 'sonner'
import { DonationsPaymentMethods } from './donations-payment-methods'

const neededItems = [
  { icon: Bone, label: 'Ração seca e úmida' },
  { icon: Syringe, label: 'Medicamentos veterinários' },
  { icon: ClipboardList, label: 'Cobertores e toalhas' },
  { icon: Dog, label: 'Produtos de higiene' },
]

function getError(errors: FieldErrors, field: string) {
  return (errors as Record<string, { message?: string } | undefined>)[field]
}

export function DonationsContent({ isAuthenticated }: { isAuthenticated?: boolean }) {
  const { create: createFiscalNote, isPending: fiscalSubmitting } = useFiscalNoteMutations()
  const [fiscalModalOpen, setFiscalModalOpen] = useState(false)

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
    createFiscalNote.mutate(payload, {
      onSuccess: () => {
        toast.success('Nota fiscal enviada com sucesso!')
        setFiscalModalOpen(false)
        fiscalForm.reset({ type: 'ACCESS_KEY' as const, accessKey: '' })
      },
    })
  }

  return (
    <PageSection>
      <DonationsPaymentMethods isAuthenticated={isAuthenticated} />

      <div className="space-y-8 mb-16">
        <Card className="border-accent/20">
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-5">
              <div className="md:col-span-3">
                <SectionHeading
                  title="Itens que precisamos"
                  description="Além de doações em dinheiro, aceitamos doações de materiais. Entre em contato para combinar a entrega."
                />
                <div className="grid grid-cols-2 gap-3">
                  {neededItems.map((item) => (
                    <div key={item.label} className="flex items-center gap-3 bg-muted/50 rounded-lg p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-sm font-medium leading-tight">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2 flex flex-col justify-center gap-4 bg-muted/30 rounded-xl p-6 border">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                    <HelpCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Dúvidas?</h3>
                    <p className="text-sm text-muted-foreground">
                      Entre em contato para mais informações
                    </p>
                  </div>
                </div>
                <Button asChild>
                  <a href="/contato">Fale Conosco</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <SectionHeading
                  title="Nota Fiscal Paulista"
                  description="Ajude a Ascesa destinando suas notas fiscais! Você pode contribuir de duas formas:"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 mb-6">
              <div className="bg-muted/50 rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-2">
                  <Key className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">Chave de Acesso</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Informe apenas a chave de 44 dígitos da nota
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">Nota Detalhada</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Informe CNPJ, valor, COO e data de emissão
                </p>
              </div>
            </div>

            <Button onClick={() => setFiscalModalOpen(true)}>
              <FileText className="h-4 w-4 mr-2" /> Enviar Nota Fiscal
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={fiscalModalOpen} onOpenChange={setFiscalModalOpen}>
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
              <Button type="button" variant="outline" onClick={() => setFiscalModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={fiscalSubmitting}>
                {fiscalSubmitting ? 'Enviando...' : 'Enviar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </PageSection>
  )
}
