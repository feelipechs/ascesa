'use client'

import { useState } from 'react'
import { formatUTC } from '@/lib/utils-date'
import type { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/data-table'
import { AdminSheet } from '@/components/admin/admin-sheet'
import { UserForm } from '@/components/admin/forms/user-form'
import { useUsers, useUserMutations } from '@/hooks/users/queries'
import { DeleteDialog } from '@/components/delete-dialog'
import { EmptyState } from '@/components/empty-state'

type UserRow = {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: Date
}

export function UsersContent() {
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const { data, isLoading } = useUsers({ page: pageIndex + 1, limit: pageSize })
  const users = data?.data ?? []
  const totalRows = data?.meta?.total ?? 0
  const { remove, isPending } = useUserMutations()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<null | { id: string }>(null)
  const [deletingUser, setDeletingUser] = useState<null | { id: string }>(null)

  function handleNew() {
    setEditingUser(null)
    setSheetOpen(true)
  }

  function handleEdit(user: { id: string }) {
    setEditingUser(user)
    setSheetOpen(true)
  }

  function handleSheetClose() {
    setSheetOpen(false)
    setEditingUser(null)
  }

  const columns: ColumnDef<UserRow>[] = [
    {
      accessorKey: 'name',
      header: 'Nome',
      cell: ({ getValue }) => <span className="font-medium">{(getValue() as string | null) ?? '—'}</span>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'role',
      header: 'Perfil',
      cell: ({ getValue }) => {
        const role = getValue() as string
        return (
          <Badge variant={role === 'ADMIN' ? 'default' : 'secondary'}>
            {role}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Criado em',
      cell: ({ getValue }) => {
        const date = getValue() as Date
        return <span className="text-muted-foreground">{formatUTC(date, 'dd/MM/yyyy')}</span>
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
          <Button size="icon" variant="ghost" onClick={() => setDeletingUser({ id: row.original.id })} className="h-8 w-8 text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Usuários</h1>
        <Button onClick={handleNew}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ) : !users || users.length === 0 ? (
        <EmptyState title="Nenhum usuário encontrado." />
      ) : (
        <DataTable
          columns={columns}
          data={users as UserRow[]}
          searchKey="name"
          enableRowSelection
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

      <AdminSheet
        open={sheetOpen}
        onClose={handleSheetClose}
        title={editingUser ? 'Editar usuário' : 'Novo usuário'}
      >
        <UserForm
          userId={editingUser?.id}
          onSuccess={handleSheetClose}
          onCancel={handleSheetClose}
        />
      </AdminSheet>

      <DeleteDialog
        open={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={() => {
          if (deletingUser)
            remove.mutate(deletingUser.id, { onSuccess: () => setDeletingUser(null) })
        }}
        isPending={isPending}
        entity="usuário"
      />
    </div>
  )
}
