'use client'

import { Heart, Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { EmptyState } from '@/components/empty-state'
import { usePaymentMethods, usePaymentMethodMutations, paymentMethodQueryOptions } from '@/hooks/payment-methods/queries'
import { Skeleton } from '@/components/ui/skeleton'
import { AdminSheet } from '@/components/admin/admin-sheet'
import { PaymentMethodForm } from '@/components/admin/forms/payment-method-form'
import { DeleteDialog } from '@/components/delete-dialog'
import { useQuery } from '@tanstack/react-query'
import { PaymentMethodCard } from './payment-method-card'
import { QrCodeDialog } from './qr-code-dialog'
import type { MethodItem } from './payment-method-card'

export function DonationsPaymentMethods({ isAuthenticated }: { isAuthenticated?: boolean }) {
  const { data: methodsData, isLoading } = usePaymentMethods()
  const methods: MethodItem[] = methodsData?.data ?? []
  const { remove, isPending: isMethodPending } = usePaymentMethodMutations()
  const [qrcodeKey, setQrcodeKey] = useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingMethodId, setEditingMethodId] = useState<string | null>(null)
  const [deletingMethodId, setDeletingMethodId] = useState<string | null>(null)

  const { data: editingMethodData } = useQuery(
    paymentMethodQueryOptions(editingMethodId ?? undefined)
  )

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
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-8 md:mb-12 lg:mb-16">
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
        <div className="mb-8 md:mb-12 lg:mb-16">
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
              {methods.map((method) => (
                <PaymentMethodCard
                  key={method.id}
                  method={method}
                  isAuthenticated={isAuthenticated}
                  onEdit={handleEditMethod}
                  onDelete={(id) => setDeletingMethodId(id)}
                  onShowQrCode={setQrcodeKey}
                />
              ))}
            </div>
          ) : (
            <EmptyState title="Nenhuma forma de doação disponível no momento." />
          )}
        </div>
      )}

      <QrCodeDialog qrcodeKey={qrcodeKey} onOpenChange={() => setQrcodeKey(null)} />

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
