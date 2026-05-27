'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AdminSheet } from '@/components/admin/admin-sheet'
import { VolunteerForm } from '@/components/admin/forms/volunteer-form'
import { useVolunteers, useVolunteerMutations } from '@/hooks/volunteers/queries'
import { DeleteDialog } from '@/components/delete-dialog'
import { EmptyState } from '@/components/shared/empty-state'

export default function AdminVolunteersPage() {
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Cadastro</TableHead>
              <TableHead className="w-20">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {volunteers.map((volunteer) => (
              <TableRow key={volunteer.id}>
                <TableCell className="font-medium">{volunteer.name}</TableCell>
                <TableCell>{volunteer.email}</TableCell>
                <TableCell className="text-muted-foreground">{volunteer.phone ?? '—'}</TableCell>
                <TableCell className="text-muted-foreground">
                  {format(volunteer.createdAt, 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(volunteer)} className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setDeletingVolunteer({ id: volunteer.id })} className="h-8 w-8 text-destructive hover:text-destructive">
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
