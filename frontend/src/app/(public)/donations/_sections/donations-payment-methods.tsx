'use client'

import { Copy, Check, Heart, Dog, QrCode, Plus } from 'lucide-react'
import { useState } from 'react'
import { QRCode } from 'react-qr-code'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { EmptyState } from '@/components/empty-state'
import { usePaymentMethods, usePaymentMethodMutations, paymentMethodQueryOptions } from '@/hooks/payment-methods/queries'
import { Skeleton } from '@/components/ui/skeleton'
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

type MethodItem = {
  id: string
  type: string
  label: string
  instructions: string | null
  isActive: boolean
  pixConfig: { key: string; receiverName: string; receiverCity: string } | null
  bankConfig: { bankName: string; agency: string; account: string; accountType: string | null } | null
}

export function DonationsPaymentMethods({ isAuthenticated }: { isAuthenticated?: boolean }) {
  const { data: methodsData, isLoading } = usePaymentMethods(true)
  const methods: MethodItem[] = methodsData?.data ?? []
  const { remove, isPending: isMethodPending } = usePaymentMethodMutations()
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [qrcodeKey, setQrcodeKey] = useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingMethodId, setEditingMethodId] = useState<string | null>(null)
  const [deletingMethodId, setDeletingMethodId] = useState<string | null>(null)

  const { data: editingMethodData } = useQuery(
    paymentMethodQueryOptions(editingMethodId ?? undefined)
  )

  function handleCopy(key: string) {
    navigator.clipboard.writeText(key)
    setCopiedId(key)
    setTimeout(() => setCopiedId(null), 2000)
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
    <>
      {isLoading ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
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
        </div>
      ) : (
        <div className="mb-16">
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
        </div>
      )}

      <Dialog open={!!qrcodeKey} onOpenChange={(open) => !open && setQrcodeKey(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>QR Code PIX</DialogTitle>
          </DialogHeader>
          <figure className="flex justify-center p-4">
            {qrcodeKey && <QRCode value={qrcodeKey} size={256} />}
          </figure>
          <p className="text-sm text-muted-foreground text-center">
            Abra o app do seu banco, escaneie o código e faça a doação.
          </p>
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

      {isAuthenticated && (
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
      )}
    </>
  )
}
