'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import type { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { DataTable } from '@/components/data-table'
import { AdminSheet } from '@/components/admin/admin-sheet'
import { VolunteerForm } from '@/components/admin/forms/volunteer-form'
import { useVolunteers, useVolunteerMutations } from '@/hooks/volunteers/queries'
import { DeleteDialog } from '@/components/delete-dialog'
import { EmptyState } from '@/components/empty-state'

type VolunteerRow = {
  id: string
  name: string
  email: string
  phone: string | null
  createdAt: Date
}

export function VolunteersContent() {
  const { data: volunteers, isLoading } = useVolunteers()
  const { remove, isPending } = useVolunteerMutations()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingVolunteer, setEditingVolunteer] = useState<null | { id: string }>(null)
  const [deletingVolunteer, setDeletingVolunteer] = useState<null | { id: string }>(null)

  function handleNew() {
    setEditingVolunteer(null)
    setSheetOpen(true)
  }

  function handleEdit(volunteer: { id: string }) {
    setEditingVolunteer(volunteer)
    setSheetOpen(true)
  }

  function handleSheetClose() {
    setSheetOpen(false)
    setEditingVolunteer(null)
  }

  const columns: ColumnDef<VolunteerRow>[] = [
    {
      accessorKey: 'name',
      header: 'Nome',
      cell: ({ getValue }) => <span className="font-medium">{getValue() as string}</span>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'phone',
      header: 'Telefone',
      cell: ({ getValue }) => {
        const phone = getValue() as string | null
        return <span className="text-muted-foreground">{phone ?? '—'}</span>
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Cadastro',
      cell: ({ getValue }) => {
        const date = getValue() as Date
        return <span className="text-muted-foreground">{format(date, 'dd/MM/yyyy')}</span>
      },
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost" onClick={() => handleEdit(row.original)} className="h-8 w-8">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => setDeletingVolunteer({ id: row.original.id })} className="h-8 w-8 text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Voluntários</h1>
        <Button onClick={handleNew}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Voluntário
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ) : !volunteers || volunteers.length === 0 ? (
        <EmptyState title="Nenhum voluntário encontrado." />
      ) : (
        <DataTable columns={columns} data={volunteers as VolunteerRow[]} searchKey="name" />
      )}

      <AdminSheet
        open={sheetOpen}
        onClose={handleSheetClose}
        title={editingVolunteer ? 'Editar voluntário' : 'Novo voluntário'}
      >
        <VolunteerForm
          volunteerId={editingVolunteer?.id}
          onSuccess={handleSheetClose}
          onCancel={handleSheetClose}
        />
      </AdminSheet>

      <DeleteDialog
        open={!!deletingVolunteer}
        onClose={() => setDeletingVolunteer(null)}
        onConfirm={() => {
          if (deletingVolunteer)
            remove.mutate(deletingVolunteer.id, { onSuccess: () => setDeletingVolunteer(null) })
        }}
        isPending={isPending}
        entity="voluntário"
      />
    </div>
  )
}
