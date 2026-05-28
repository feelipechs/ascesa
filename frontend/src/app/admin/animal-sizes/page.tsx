'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AdminSheet } from '@/components/admin/admin-sheet'
import { AnimalSizeForm } from '@/components/admin/forms/animal-size-form'
import { useAnimalSizes, useAnimalSizeMutations } from '@/hooks/animal-sizes/queries'
import { DeleteDialog } from '@/components/delete-dialog'
import { EmptyState } from '@/components/empty-state'

export default function AdminAnimalSizesPage() {
  const { data: sizes, isLoading } = useAnimalSizes()
  const { remove, isPending } = useAnimalSizeMutations()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingId, setEditingId] = useState<null | string>(null)
  const [deletingId, setDeletingId] = useState<null | string>(null)

  function handleNew() {
    setEditingId(null)
    setSheetOpen(true)
  }

  function handleEdit(id: string) {
    setEditingId(id)
    setSheetOpen(true)
  }

  function handleSheetClose() {
    setSheetOpen(false)
    setEditingId(null)
  }

  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Portes</h1>
        <Button onClick={handleNew}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Porte
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ) : !sizes || sizes.length === 0 ? (
        <EmptyState title="Nenhum porte cadastrado." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Ordem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="w-20">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sizes.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="text-muted-foreground text-sm">{s.order}</TableCell>
                <TableCell className="font-medium">{s.label}</TableCell>
                <TableCell className="text-muted-foreground">{s.description}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(s.id)} className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setDeletingId(s.id)} className="h-8 w-8 text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <AdminSheet
        open={sheetOpen}
        onClose={handleSheetClose}
        title={editingId ? 'Editar porte' : 'Novo porte'}
      >
        <AnimalSizeForm
          sizeId={editingId ?? undefined}
          onSuccess={handleSheetClose}
          onCancel={handleSheetClose}
        />
      </AdminSheet>

      <DeleteDialog
        open={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) remove.mutate(deletingId, { onSuccess: () => setDeletingId(null) })
        }}
        isPending={isPending}
        entity="porte"
      />
    </div>
  )
}
