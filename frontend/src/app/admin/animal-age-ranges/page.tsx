'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AdminSheet } from '@/components/admin/admin-sheet'
import { AnimalAgeRangeForm } from '@/components/admin/forms/animal-age-range-form'
import { useAnimalAgeRanges, useAnimalAgeRangeMutations } from '@/hooks/animal-age-ranges/queries'
import { DeleteDialog } from '@/components/delete-dialog'
import { EmptyState } from '@/components/empty-state'

export default function AdminAnimalAgeRangesPage() {
  const { data: ranges, isLoading } = useAnimalAgeRanges()
  const { remove, isPending } = useAnimalAgeRangeMutations()
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
        <h1 className="text-2xl font-semibold">Faixas Etárias</h1>
        <Button onClick={handleNew}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Faixa Etária
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ) : !ranges || ranges.length === 0 ? (
        <EmptyState title="Nenhuma faixa etária cadastrada." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Ordem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Idade mínima</TableHead>
              <TableHead>Idade máxima</TableHead>
              <TableHead className="w-20">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ranges.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="text-muted-foreground text-sm">{r.order}</TableCell>
                <TableCell className="font-medium">{r.label}</TableCell>
                <TableCell className="text-muted-foreground">{r.minAge ?? '—'}</TableCell>
                <TableCell className="text-muted-foreground">{r.maxAge ?? '—'}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(r.id)} className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setDeletingId(r.id)} className="h-8 w-8 text-destructive">
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
        title={editingId ? 'Editar faixa etária' : 'Nova faixa etária'}
      >
        <AnimalAgeRangeForm
          rangeId={editingId ?? undefined}
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
        entity="faixa etária"
      />
    </div>
  )
}
