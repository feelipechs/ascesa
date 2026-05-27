'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AdminActions } from '@/components/admin/admin-actions'
import { AdminSheet } from '@/components/admin/admin-sheet'
import { TestimonialForm } from '@/components/admin/forms/testimonial-form'
import { useTestimonials, useTestimonialMutations } from '@/hooks/testimonials/queries'
import { DeleteDialog } from '@/components/delete-dialog'

type TestimonialsSectionProps = {
  projectId: string
  isAuthenticated?: boolean
}

export function TestimonialsSection({ projectId, isAuthenticated }: TestimonialsSectionProps) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<null | { id: string }>(null)
  const [deletingTestimonial, setDeletingTestimonial] = useState<null | { id: string }>(null)
  const { data: testimonials = [] } = useTestimonials({ projectId })
  const { remove, isPending } = useTestimonialMutations()

  if (testimonials.length === 0 && !isAuthenticated) return null

  function handleNew() {
    setEditingTestimonial(null)
    setSheetOpen(true)
  }

  function handleEdit(testimonial: { id: string }) {
    setEditingTestimonial(testimonial)
    setSheetOpen(true)
  }

  function handleSheetClose() {
    setSheetOpen(false)
    setEditingTestimonial(null)
  }

  return (
    <>
      <Separator />
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-foreground">Depoimentos</h2>
          {isAuthenticated && (
            <Button size="sm" onClick={handleNew}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          )}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="group relative bg-muted/50">
              {isAuthenticated && (
                <div className="absolute top-2 right-2 z-10">
                  <AdminActions
                    onEdit={() => handleEdit(testimonial)}
                    onDelete={() => setDeletingTestimonial({ id: testimonial.id })}
                  />
                </div>
              )}
              <CardContent className="pt-6">
                <p className="mb-4 text-muted-foreground italic leading-relaxed">
                  &ldquo;{testimonial.message}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-foreground">{testimonial.name}</span>
                  {testimonial.role && (
                    <span className="text-sm text-muted-foreground">— {testimonial.role}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {isAuthenticated && (
        <AdminSheet
          open={sheetOpen}
          onClose={handleSheetClose}
          title={editingTestimonial ? 'Editar depoimento' : 'Novo depoimento'}
        >
          <TestimonialForm
            projectId={projectId}
            testimonialId={editingTestimonial?.id}
            onSuccess={handleSheetClose}
            onCancel={handleSheetClose}
          />
        </AdminSheet>
      )}

      <DeleteDialog
        open={!!deletingTestimonial}
        onClose={() => setDeletingTestimonial(null)}
        onConfirm={() => {
          if (deletingTestimonial)
            remove.mutate(deletingTestimonial.id, { onSuccess: () => setDeletingTestimonial(null) })
        }}
        isPending={isPending}
        entity="depoimento"
      />
    </>
  )
}
