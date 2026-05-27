'use client'
import { useState, useCallback } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { usePartners, usePartnerMutations } from '@/hooks/partners/queries'
import { Partners } from './partners'
import { AdminSheet } from '@/components/admin/admin-sheet'
import { PartnerForm } from '@/components/admin/forms/partner-form'
import { Button } from '@/components/ui/button'
import { DeleteDialog } from '@/components/delete-dialog'
import { EmptyState } from '@/components/shared/empty-state'
import type { Partner } from '@/types'

export function PartnersContent({ isAuthenticated }: { isAuthenticated?: boolean }) {
  const { data: partners, isLoading } = usePartners()
  const { remove, isPending } = usePartnerMutations()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingPartner, setEditingPartner] = useState<null | { id: string }>(null)
  const [deletingPartner, setDeletingPartner] = useState<null | { id: string }>(null)

  const handleNew = useCallback(() => {
    setEditingPartner(null)
    setSheetOpen(true)
  }, [])
  const handleEdit = useCallback((partner: Partner) => {
    setEditingPartner(partner)
    setSheetOpen(true)
  }, [])
  const handleDelete = useCallback((partner: Partner) => {
    setDeletingPartner(partner)
  }, [])
  const handleClose = useCallback(() => {
    setSheetOpen(false)
    setEditingPartner(null)
  }, [])

  if (isLoading)
    return (
      <section className="border-t border-border py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <Skeleton className="mx-auto mb-12 h-8 w-64" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    )

  if ((partners ?? []).length === 0)
    return <EmptyState title="Nenhum parceiro cadastrado." />

  return (
    <>
      <Partners
        partners={partners ?? []}
        isAuthenticated={isAuthenticated}
        onAdd={handleNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isAuthenticated && (
        <>
          <AdminSheet
            open={sheetOpen}
            onClose={handleClose}
            title={editingPartner ? 'Editar parceiro' : 'Novo parceiro'}
          >
            <PartnerForm
              partnerId={editingPartner?.id}
              onSuccess={handleClose}
              onCancel={handleClose}
            />
          </AdminSheet>

          <DeleteDialog
            open={!!deletingPartner}
            onClose={() => setDeletingPartner(null)}
            onConfirm={() => {
              if (deletingPartner)
                remove.mutate(deletingPartner.id, { onSuccess: () => setDeletingPartner(null) })
            }}
            isPending={isPending}
            entity="parceiro"
          />
        </>
      )}
    </>
  )
}
