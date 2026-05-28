'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAreas, useAreaMutations } from '@/hooks/areas/queries'
import { AreasGrid } from './areas-grid'
import { AdminSheet } from '@/components/admin/admin-sheet'
import { AreaForm } from '@/components/admin/forms/area-form'
import { DeleteDialog } from '@/components/delete-dialog'
import { PageSection } from '@/components/page-section'

type AreasContentProps = {
  isAuthenticated?: boolean
}

export function AreasContent({ isAuthenticated }: AreasContentProps) {
  const { data: areas = [], isLoading } = useAreas()
  const { remove, isPending } = useAreaMutations()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingArea, setEditingArea] = useState<null | { id: string }>(null)
  const [deletingArea, setDeletingArea] = useState<null | { id: string }>(null)

  function handleEdit(area: { id: string }) {
    setEditingArea(area)
    setSheetOpen(true)
  }

  function handleNew() {
    setEditingArea(null)
    setSheetOpen(true)
  }

  function handleSheetClose() {
    setSheetOpen(false)
    setEditingArea(null)
  }

  function handleDelete(area: { id: string }) {
    setDeletingArea(area)
  }

  function confirmDelete() {
    if (deletingArea) {
      remove.mutate(deletingArea.id, {
        onSuccess: () => setDeletingArea(null),
      })
    }
  }

  return (
    <>
      <PageSection padding="compact" className="space-y-6">
        {isAuthenticated && (
          <div className="flex justify-end">
            <Button onClick={handleNew} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
        )}

        <AreasGrid
          areas={areas}
          isLoading={isLoading}
          isAuthenticated={isAuthenticated}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </PageSection>

      {isAuthenticated && (
        <AdminSheet
          open={sheetOpen}
          onClose={handleSheetClose}
          title={editingArea ? 'Editar área' : 'Nova área'}
        >
          <AreaForm
            areaId={editingArea?.id}
            onSuccess={handleSheetClose}
            onCancel={handleSheetClose}
          />
        </AdminSheet>
      )}

      <DeleteDialog
        open={!!deletingArea}
        onClose={() => setDeletingArea(null)}
        onConfirm={() => {
          if (deletingArea)
            remove.mutate(deletingArea.id, { onSuccess: () => setDeletingArea(null) })
        }}
        entity="área"
        description="Tem certeza que deseja excluir esta área? Esta ação não pode ser desfeita."
        isPending={isPending}
      />
    </>
  )
}
