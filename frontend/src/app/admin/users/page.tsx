'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { AdminSheet } from '@/components/admin/admin-sheet'
import { UserForm } from '@/components/admin/forms/user-form'
import { useUsers, useUserMutations } from '@/hooks/users/queries'
import { DeleteDialog } from '@/components/delete-dialog'
import { EmptyState } from '@/components/shared/empty-state'

export default function UsersPage() {
  const { data: users, isLoading } = useUsers()
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="w-20">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name ?? '—'}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(user.createdAt, 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(user)} className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setDeletingUser({ id: user.id })} className="h-8 w-8 text-destructive hover:text-destructive">
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
