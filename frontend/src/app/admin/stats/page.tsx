'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AdminSheet } from '@/components/admin/admin-sheet'
import { StatForm } from '@/components/admin/forms/stat-form'
import { useStats, useStatMutations } from '@/hooks/stats/queries'
import { DeleteDialog } from '@/components/delete-dialog'
import { EmptyState } from '@/components/shared/empty-state'

export default function AdminStatsPage() {
  const { data: stats, isLoading } = useStats()
  const { remove, isPending } = useStatMutations()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingStat, setEditingStat] = useState<null | { id: string }>(null)
  const [deletingStat, setDeletingStat] = useState<null | { id: string }>(null)

  function handleNew() {
    setEditingStat(null)
    setSheetOpen(true)
  }

  function handleEdit(stat: { id: string }) {
    setEditingStat(stat)
    setSheetOpen(true)
  }

  function handleSheetClose() {
    setSheetOpen(false)
    setEditingStat(null)
  }

  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Estatísticas</h1>
        <Button onClick={handleNew}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Métrica
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ) : !stats || stats.length === 0 ? (
        <EmptyState title="Nenhuma métrica encontrada." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">#</TableHead>
              <TableHead>Label</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Ordem</TableHead>
              <TableHead className="w-20">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.map((stat, index) => (
              <TableRow key={stat.id}>
                <TableCell className="text-muted-foreground text-sm">{index + 1}</TableCell>
                <TableCell className="font-medium">{stat.label}</TableCell>
                <TableCell>{stat.value}</TableCell>
                <TableCell className="text-muted-foreground">{(stat as { order?: number }).order ?? index}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(stat)} className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setDeletingStat({ id: stat.id })} className="h-8 w-8 text-destructive hover:text-destructive">
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
        title={editingStat ? 'Editar métrica' : 'Nova métrica'}
      >
        <StatForm
          statId={editingStat?.id}
          onSuccess={handleSheetClose}
          onCancel={handleSheetClose}
        />
      </AdminSheet>

      <DeleteDialog
        open={!!deletingStat}
        onClose={() => setDeletingStat(null)}
        onConfirm={() => {
          if (deletingStat)
            remove.mutate(deletingStat.id, { onSuccess: () => setDeletingStat(null) })
        }}
        isPending={isPending}
        entity="métrica"
      />
    </div>
  )
}
