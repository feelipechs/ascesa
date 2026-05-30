'use client'

import { Copy, Check, Heart, Dog, Syringe, Bone, ClipboardList, QrCode, FileText, Key, HelpCircle, Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm, type FieldErrors } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { QRCode } from 'react-qr-code'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageSection } from '@/components/page-section'
import { EmptyState } from '@/components/empty-state'
import { usePaymentMethods, usePaymentMethodMutations, paymentMethodQueryOptions } from '@/hooks/payment-methods/queries'
import { useFiscalNoteMutations } from '@/hooks/fiscal-notes/queries'
import { Skeleton } from '@/components/ui/skeleton'
import { createFiscalNoteSchema } from '@/schemas/fiscal-note.schema'
import { toast } from 'sonner'
import { AdminActions } from '@/components/admin/admin-actions'
import { AdminSheet } from '@/components/admin/admin-sheet'
import { PaymentMethodForm } from '@/components/admin/forms/payment-method-form'
import { DeleteDialog } from '@/components/delete-dialog'
import { useQuery } from '@tanstack/react-query'

const typeIcons: Record<string, typeof Heart> = {
  PIX: Copy,
  BANK_TRANSFER: Heart,
  CASH: Dog,
}

const typeLabels: Record<string, string> = {
  PIX: 'PIX',
  BANK_TRANSFER: 'Transferência Bancária',
  CASH: 'Doação em Dinheiro',
}

const neededItems = [
  { icon: Bone, label: 'Ração seca e úmida' },
  { icon: Syringe, label: 'Medicamentos veterinários' },
  { icon: ClipboardList, label: 'Cobertores e toalhas' },
  { icon: Dog, label: 'Produtos de higiene' },
]

function getError(errors: FieldErrors, field: string) {
  return (errors as Record<string, { message?: string } | undefined>)[field]
}

type MethodItem = {
  id: string
  type: string
  label: string
  instructions: string | null
  isActive: boolean
  pixConfig: { key: string; receiverName: string; receiverCity: string } | null
  bankConfig: { bankName: string; agency: string; account: string; accountType: string | null } | null
}

export function DonationsContent({ isAuthenticated }: { isAuthenticated?: boolean }) {
  const { data: methodsData, isLoading } = usePaymentMethods(true)
  const methods: MethodItem[] = methodsData?.data ?? []
  const { create: createFiscalNote, isPending: fiscalSubmitting } = useFiscalNoteMutations()
  const { remove, isPending: isMethodPending } = usePaymentMethodMutations()
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [qrcodeKey, setQrcodeKey] = useState<string | null>(null)
  const [fiscalModalOpen, setFiscalModalOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingMethodId, setEditingMethodId] = useState<string | null>(null)
  const [deletingMethodId, setDeletingMethodId] = useState<string | null>(null)

  const { data: editingMethodData } = useQuery(
    paymentMethodQueryOptions(editingMethodId ?? undefined)
  )

  const fiscalForm = useForm({
    resolver: zodResolver(createFiscalNoteSchema),
    defaultValues: {
      type: 'ACCESS_KEY' as const,
      accessKey: '',
    },
  })

  const fiscalType = fiscalForm.watch('type')
  const errors = fiscalForm.formState.errors

  function handleCopy(key: string) {
    navigator.clipboard.writeText(key)
    setCopiedId(key)
    setTimeout(() => setCopiedId(null), 2000)
  }

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

  function handleNewMethod() {
    setEditingMethodId(null)
    setSheetOpen(true)
  }

  function handleEditMethod(id: string) {
    setEditingMethodId(id)
    setSheetOpen(true)
  }

  function handleMethodSheetClose() {
    setSheetOpen(false)
    setEditingMethodId(null)
  }

  return (
    <PageSection>
      {isLoading ? (
        <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-12 w-12 rounded-lg mb-3" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </section>
      ) : (
        <section className="mb-16">
          {isAuthenticated && (
            <div className="flex justify-end mb-6">
              <Button size="sm" onClick={handleNewMethod}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Método
              </Button>
            </div>
          )}

          {methods.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {methods.map((method) => {
                const Icon = typeIcons[method.type] ?? Heart
                return (
                  <Card key={method.id} className="flex flex-col relative">
                    {isAuthenticated && (
                      <div className="absolute top-3 right-3 z-10">
                        <AdminActions
                          onEdit={() => handleEditMethod(method.id)}
                          onDelete={() => setDeletingMethodId(method.id)}
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-3">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{method.label}</CardTitle>
                      <CardDescription>{typeLabels[method.type] ?? method.type}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between gap-4">
                      {method.instructions && (
                        <p className="text-sm text-muted-foreground">{method.instructions}</p>
                      )}

                      {method.type === 'PIX' && method.pixConfig && (
                        <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                          <p className="text-xs text-muted-foreground">Chave PIX</p>
                          <p className="font-mono text-sm break-all">{method.pixConfig.key}</p>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => handleCopy(method.pixConfig!.key)}
                            >
                              {copiedId === method.pixConfig.key ? (
                                <>
                                  <Check className="h-4 w-4 mr-2" />
                                  Copiado!
                                </>
                              ) : (
                                <>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copiar chave
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setQrcodeKey(method.pixConfig!.key)}
                            >
                              <QrCode className="h-4 w-4 mr-2" />
                              QR Code
                            </Button>
                          </div>
                        </div>
                      )}

                      {method.type === 'BANK_TRANSFER' && method.bankConfig && (
                        <div className="bg-muted/50 rounded-lg p-3 space-y-1 text-sm">
                          <p>
                            <span className="text-muted-foreground">Banco:</span>{' '}
                            {method.bankConfig.bankName}
                          </p>
                          <p>
                            <span className="text-muted-foreground">Agência:</span>{' '}
                            {method.bankConfig.agency}
                          </p>
                          <p>
                            <span className="text-muted-foreground">Conta:</span>{' '}
                            {method.bankConfig.account}
                          </p>
                          {method.bankConfig.accountType && (
                            <p>
                              <span className="text-muted-foreground">Tipo:</span>{' '}
                              {method.bankConfig.accountType}
                            </p>
                          )}
                        </div>
                      )}

                      {method.type === 'CASH' && (
                        <Button variant="outline" className="w-full" asChild>
                          <a href="/contato">Fale Conosco</a>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <EmptyState title="Nenhuma forma de doação disponível no momento." />
          )}
        </section>
      )}

      <div className="space-y-8 mb-16">
        <Card className="border-accent/20">
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-5">
              <div className="md:col-span-3">
                <h2 className="text-2xl font-bold tracking-tight mb-4">Itens que precisamos</h2>
                <p className="text-muted-foreground mb-6">
                  Além de doações em dinheiro, aceitamos doações de materiais. Entre em contato para
                  combinar a entrega.
                </p>
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
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Nota Fiscal Paulista</h2>
                <p className="text-muted-foreground mt-1">
                  Ajude a Ascesa destinando suas notas fiscais! Você pode contribuir de duas formas:
                </p>
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

      <Dialog open={!!qrcodeKey} onOpenChange={(open) => !open && setQrcodeKey(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>QR Code PIX</DialogTitle>
          </DialogHeader>
          <figure className="flex justify-center p-4">
            {qrcodeKey && (
              <QRCode value={qrcodeKey} size={256} />
            )}
          </figure>
          <p className="text-sm text-muted-foreground text-center">
            Abra o app do seu banco, escaneie o código e faça a doação.
          </p>
        </DialogContent>
      </Dialog>

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

      {isAuthenticated && (
        <AdminSheet
          open={sheetOpen}
          onClose={handleMethodSheetClose}
          title={editingMethodId ? 'Editar método' : 'Novo método'}
        >
          <PaymentMethodForm
            method={editingMethodId ? (editingMethodData as Record<string, unknown> | undefined) : undefined}
            onSuccess={handleMethodSheetClose}
            onCancel={handleMethodSheetClose}
          />
        </AdminSheet>
      )}

      <DeleteDialog
        open={!!deletingMethodId}
        onClose={() => setDeletingMethodId(null)}
        onConfirm={() => {
          if (deletingMethodId)
            remove.mutate(deletingMethodId, { onSuccess: () => setDeletingMethodId(null) })
        }}
        isPending={isMethodPending}
        entity="método de pagamento"
      />
    </PageSection>
  )
}
