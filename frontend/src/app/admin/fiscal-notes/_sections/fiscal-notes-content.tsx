'use client'

import { useState } from 'react'
import { formatUTC } from '@/lib/utils-date'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Trash2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
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
  const [deletingId, setDeletingId] = useState<null | string>(null)

  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Notas Fiscais</h1>
      </div>

      {!response ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ) : notes.length === 0 ? (
        <EmptyState title="Nenhuma nota fiscal pendente." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>CNPJ / Chave</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Enviada em</TableHead>
              <TableHead className="w-20">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notes.map((s: FiscalNote) => (
              <TableRow key={s.id}>
                <TableCell>
                  <Badge variant="outline">{typeLabels[s.type] ?? s.type}</Badge>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {s.type === 'ACCESS_KEY' ? s.accessKey ?? '—' : s.cnpj ?? '—'}
                </TableCell>
      <TableCell>
        {s.emissionDate ? formatUTC(s.emissionDate, 'dd/MM/yyyy') : '—'}
      </TableCell>
        <TableCell>{s.amount ? `R$ ${s.amount}` : '—'}</TableCell>
        <TableCell>{formatUTC(s.createdAt, 'dd/MM/yyyy HH:mm')}</TableCell>
        <TableCell>
          <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setDeletingId(s.id)}
                    className="h-8 w-8 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <DeleteDialog
        open={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId)
            remove.mutate(deletingId, { onSuccess: () => setDeletingId(null) })
        }}
        isPending={isPending}
        entity="nota fiscal"
      />
    </div>
  )
}
