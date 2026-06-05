'use client'
import { useState, useCallback } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { usePartners, usePartnerMutations } from '@/hooks/partners/queries'
import { Partners } from './partners-section'
import { AdminSheet } from '@/components/admin/admin-sheet'
import { PartnerForm } from '@/components/admin/forms/partner-form'
import { DeleteDialog } from '@/components/delete-dialog'
import { EmptyState } from '@/components/empty-state'
import { PageSection } from '@/components/page-section'
import { SectionHeading } from '@/components/section-heading'
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
      <PageSection borderTop width="wide" padding="compact">
        <Skeleton className="mx-auto mb-12 h-8 w-64" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </PageSection>
    )

  return (
    <>
      <PageSection borderTop width="wide" padding="compact">
        <SectionHeading
          title="Parceiros"
          description="Quem apoia a Ascesa."
          action={isAuthenticated ? { label: 'Adicionar', onClick: handleNew } : undefined}
        />

        {(partners ?? []).length > 0 ? (
          <Partners
            partners={partners ?? []}
            isAuthenticated={isAuthenticated}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <EmptyState title="Nenhum parceiro cadastrado." />
        )}
      </PageSection>

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
