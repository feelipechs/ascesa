'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { AdminSheet } from '@/components/admin/admin-sheet'
import { FiscalNoteForm } from '@/components/admin/forms/fiscal-note-form'
import { useFiscalNotes, useFiscalNoteMutations } from '@/hooks/fiscal-notes/queries'
import { DeleteDialog } from '@/components/delete-dialog'
import { EmptyState } from '@/components/empty-state'
import type { FiscalNote } from '@/types'

const typeLabels: Record<string, string> = {
  DETAILED: 'Nota Detalhada',
  ACCESS_KEY: 'Chave de Acesso',
}

export function FiscalNotesContent() {
  const { data: response } = useFiscalNotes()
  const notes = (response as { data: FiscalNote[] } | undefined)?.data ?? []
  const { remove, isPending } = useFiscalNoteMutations()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState<FiscalNote | null>(null)
  const [deletingId, setDeletingId] = useState<null | string>(null)

  function handleNew() {
    setEditing(null)
    setSheetOpen(true)
  }

  function handleEdit(note: FiscalNote) {
    setEditing(note)
    setSheetOpen(true)
  }

  function handleSheetClose() {
    setSheetOpen(false)
    setEditing(null)
  }

  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Notas Fiscais</h1>
        <Button onClick={handleNew}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Nota Fiscal
        </Button>
      </div>

      {!response ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ) : notes.length === 0 ? (
        <EmptyState title="Nenhuma nota fiscal cadastrada." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>CNPJ / Chave</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead className="w-20">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notes.map((n: FiscalNote) => (
              <TableRow key={n.id}>
                <TableCell>
                  <Badge variant="outline">{typeLabels[n.type] ?? n.type}</Badge>
                </TableCell>
                <TableCell className="font-mono text-xs">{n.type === 'ACCESS_KEY' ? n.accessKey ?? '—' : n.cnpj ?? '—'}</TableCell>
                <TableCell>{n.emissionDate ? format(new Date(n.emissionDate), "dd/MM/yyyy") : '—'}</TableCell>
                <TableCell>{n.amount ? `R$ ${Number(n.amount).toFixed(2)}` : '—'}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(n)} className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setDeletingId(n.id)} className="h-8 w-8 text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <AdminSheet open={sheetOpen} onClose={handleSheetClose} title={editing ? 'Editar nota fiscal' : 'Nova nota fiscal'}>
        <FiscalNoteForm note={editing ?? undefined} onSuccess={handleSheetClose} onCancel={handleSheetClose} />
      </AdminSheet>

      <DeleteDialog
        open={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) remove.mutate(deletingId, { onSuccess: () => setDeletingId(null) })
        }}
        isPending={isPending}
        entity="nota fiscal"
      />
    </div>
  )
}
