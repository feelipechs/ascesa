'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { AdminSheet } from '@/components/admin/admin-sheet'
import { PaymentMethodForm } from '@/components/admin/forms/payment-method-form'
import { usePaymentMethods, usePaymentMethodMutations } from '@/hooks/payment-methods/queries'
import { DeleteDialog } from '@/components/delete-dialog'
import { EmptyState } from '@/components/empty-state'

const typeLabels: Record<string, string> = {
  PIX: 'PIX',
  BANK_TRANSFER: 'Transferência',
  CASH: 'Dinheiro',
}

export default function AdminPaymentMethodsPage() {
  const { data, isLoading } = usePaymentMethods()
  const { remove, isPending } = usePaymentMethodMutations()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null)
  const [deletingId, setDeletingId] = useState<null | string>(null)

  const methods = (data as { data?: Record<string, unknown>[] } | undefined)?.data ?? []

  function handleNew() {
    setEditing(null)
    setSheetOpen(true)
  }

  function handleEdit(method: Record<string, unknown>) {
    setEditing(method)
    setSheetOpen(true)
  }

  function handleSheetClose() {
    setSheetOpen(false)
    setEditing(null)
  }

  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Métodos de Pagamento</h1>
        <Button onClick={handleNew}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Método
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ) : methods.length === 0 ? (
        <EmptyState title="Nenhum método de pagamento cadastrado." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ordem</TableHead>
              <TableHead>Label</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Ativo</TableHead>
              <TableHead className="w-20">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {methods.map((m: Record<string, unknown>) => (
              <TableRow key={m.id as string}>
                <TableCell className="text-muted-foreground text-sm">{m.displayOrder as number}</TableCell>
                <TableCell className="font-medium">{m.label as string}</TableCell>
                <TableCell>
                  <Badge variant="outline">{typeLabels[m.type as string] ?? (m.type as string)}</Badge>
                </TableCell>
                <TableCell>{m.isActive ? 'Sim' : 'Não'}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(m)} className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setDeletingId(m.id as string)} className="h-8 w-8 text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <AdminSheet open={sheetOpen} onClose={handleSheetClose} title={editing ? 'Editar método' : 'Novo método'}>
        <PaymentMethodForm method={editing ?? undefined} onSuccess={handleSheetClose} onCancel={handleSheetClose} />
      </AdminSheet>

      <DeleteDialog
        open={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) remove.mutate(deletingId, { onSuccess: () => setDeletingId(null) })
        }}
        isPending={isPending}
        entity="método de pagamento"
      />
    </div>
  )
}
