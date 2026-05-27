'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useAreas, useAreaMutations } from '@/hooks/areas/queries'
import { AreasGrid } from './areas-grid'
import { AdminSheet } from '@/components/admin/admin-sheet'
import { AreaForm } from '@/components/admin/forms/area-form'
import { DeleteDialog } from '@/components/delete-dialog'

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
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-6">
          {isAuthenticated && (
            <div className="flex justify-end">
              <Button onClick={handleNew} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar área
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
        </div>
      </section>

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
