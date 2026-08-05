'use client'

import { useState } from 'react'
import { formatUTC } from '@/lib/utils-date'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/data-table'
import { useFiscalNotes, useFiscalNoteMutations } from '@/hooks/fiscal-notes/queries'
import { DeleteDialog } from '@/components/delete-dialog'
import { EmptyState } from '@/components/empty-state'
import type { FiscalNote } from '@/types'

const typeLabels: Record<string, string> = {
  DETAILED: 'Nota Detalhada',
  ACCESS_KEY: 'Chave de Acesso',
}

export function FiscalNotesContent() {
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const { data: response } = useFiscalNotes({ page: pageIndex + 1, limit: pageSize })
  const notes = response?.data ?? []
  const totalRows = response?.meta?.total ?? 0
  const { remove, isPending } = useFiscalNoteMutations()
  const [deletingId, setDeletingId] = useState<null | string>(null)

  const columns: ColumnDef<FiscalNote>[] = [
    {
      accessorKey: 'type',
      header: 'Tipo',
      cell: ({ getValue }) => {
        const type = getValue() as string
        return <Badge variant="outline">{typeLabels[type] ?? type}</Badge>
      },
    },
    {
      id: 'document',
      header: 'CNPJ / Chave',
      cell: ({ row }) => {
        const note = row.original
        return (
          <span className="font-mono text-xs">
            {note.type === 'ACCESS_KEY' ? note.accessKey ?? '—' : note.cnpj ?? '—'}
          </span>
        )
      },
    },
    {
      accessorKey: 'emissionDate',
      header: 'Data',
      cell: ({ getValue }) => {
        const date = getValue() as Date | null
        return date ? formatUTC(date, 'dd/MM/yyyy') : '—'
      },
    },
    {
      accessorKey: 'amount',
      header: 'Valor',
      cell: ({ getValue }) => {
        const amount = getValue() as number | null
        return amount ? `R$ ${amount}` : '—'
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Enviada em',
      cell: ({ getValue }) => formatUTC(getValue() as Date, 'dd/MM/yyyy HH:mm'),
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => (
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setDeletingId(row.original.id)}
          className="h-8 w-8 text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ]

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
        <DataTable
          columns={columns}
          data={notes}
          serverPagination={{
            totalRows,
            pageIndex,
            pageSize,
            onPaginationChange: ({ pageIndex: nextPage, pageSize: nextSize }) => {
              setPageSize(nextSize)
              setPageIndex(nextSize !== pageSize ? 0 : nextPage)
            },
          }}
        />
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
