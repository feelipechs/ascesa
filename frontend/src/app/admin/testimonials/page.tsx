'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Pencil, Trash2, Star } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { AdminSheet } from '@/components/admin/admin-sheet'
import { TestimonialForm } from '@/components/admin/forms/testimonial-form'
import { useTestimonials, useTestimonialMutations } from '@/hooks/testimonials/queries'
import { DeleteDialog } from '@/components/delete-dialog'
import { EmptyState } from '@/components/empty-state'

export default function AdminTestimonialsPage() {
  const { data: testimonials = [], isLoading } = useTestimonials()
  const { remove, isPending } = useTestimonialMutations()
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
        <h1 className="text-2xl font-semibold">Depoimentos</h1>
        <Button onClick={handleNew}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Depoimento
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ) : !testimonials || testimonials.length === 0 ? (
        <EmptyState title="Nenhum depoimento cadastrado." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Mensagem</TableHead>
              <TableHead>Destaque</TableHead>
              <TableHead className="w-20">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell className="text-muted-foreground max-w-xs truncate">{t.message}</TableCell>
                <TableCell>
                  {t.featured ? (
                    <Badge variant="default" className="gap-1">
                      <Star className="h-3 w-3" />
                      Destaque
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(t.id)} className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setDeletingId(t.id)} className="h-8 w-8 text-destructive">
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
        title={editingId ? 'Editar depoimento' : 'Novo depoimento'}
      >
        <TestimonialForm
          testimonialId={editingId ?? undefined}
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
        entity="depoimento"
      />
    </div>
  )
}
