'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AdminSheet } from '@/components/admin/admin-sheet'
import { AnimalSpeciesForm } from '@/components/admin/forms/animal-species-form'
import { useAnimalSpecies, useAnimalSpeciesMutations } from '@/hooks/animal-species/queries'
import { DeleteDialog } from '@/components/delete-dialog'
import { EmptyState } from '@/components/empty-state'

export default function AdminAnimalSpeciesPage() {
  const { data: species, isLoading } = useAnimalSpecies()
  const { remove, isPending } = useAnimalSpeciesMutations()
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
        <h1 className="text-2xl font-semibold">Espécies</h1>
        <Button onClick={handleNew}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Espécie
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ) : !species || species.length === 0 ? (
        <EmptyState title="Nenhuma espécie cadastrada." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Ordem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead className="w-20">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {species.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="text-muted-foreground text-sm">{s.order}</TableCell>
                <TableCell className="font-medium">{s.name}</TableCell>
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
        title={editingId ? 'Editar espécie' : 'Nova espécie'}
      >
        <AnimalSpeciesForm
          speciesId={editingId ?? undefined}
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
        entity="espécie"
      />
    </div>
  )
}
