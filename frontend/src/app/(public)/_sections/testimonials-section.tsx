'use client'

import { useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { AdminActions } from '@/components/admin/admin-actions'
import { AdminSheet } from '@/components/admin/admin-sheet'
import { TestimonialForm } from '@/components/admin/forms/testimonial-form'
import { useTestimonials, useTestimonialMutations } from '@/hooks/testimonials/queries'
import { DeleteDialog } from '@/components/delete-dialog'
import { SafeImage } from '@/components/safe-image'
import { EmptyState } from '@/components/empty-state'
import { PageSection } from '@/components/page-section'
import { SectionHeading } from '@/components/section-heading'
import { Marquee } from '@/components/ui/marquee'

type TestimonialsSectionProps = {
  isAuthenticated?: boolean
}

export function TestimonialsSection({ isAuthenticated }: TestimonialsSectionProps) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<null | { id: string }>(null)
  const [deletingTestimonial, setDeletingTestimonial] = useState<null | { id: string }>(null)
  const { data: testimonials = [], isLoading } = useTestimonials()
  const { remove, isPending } = useTestimonialMutations()

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

  if (isLoading)
    return (
      <section className="py-8 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <Skeleton className="mx-auto mb-12 h-8 w-48" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    )

  return (
    <>
      <PageSection borderTop width="wide" padding="compact">
        <SectionHeading
          title={
            <>
              Quem ama, <span className="text-primary underline underline-offset-4">diz</span>
            </>
          }
          description="Histórias reais de quem viveu a transformação."
          action={isAuthenticated ? { label: 'Adicionar', onClick: handleNew } : undefined}
        />

        {testimonials.length > 0 ? (
          <Marquee pauseOnHover repeat={2} className="[--duration:60s] [--gap:1.5rem]">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="group relative bg-muted/50 w-80">
                {isAuthenticated && (
                  <div className="absolute top-2 right-2 z-10">
                    <AdminActions
                      onEdit={() => handleEdit(testimonial)}
                      onDelete={() => setDeletingTestimonial({ id: testimonial.id })}
                    />
                  </div>
                )}
                <CardContent className="pt-6 flex flex-col gap-4">
                  {testimonial.photoUrl ? (
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full overflow-hidden shrink-0">
                        <SafeImage
                          src={testimonial.photoUrl}
                          alt={testimonial.name}
                          className="object-cover h-full w-full"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{testimonial.name}</p>
                        {testimonial.role && (
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium text-foreground">{testimonial.name}</p>
                      {testimonial.role && (
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      )}
                    </div>
                  )}
                  <p className="text-muted-foreground italic leading-relaxed">
                    &ldquo;{testimonial.message}&rdquo;
                  </p>
                </CardContent>
              </Card>
            ))}
          </Marquee>
        ) : (
          <EmptyState title="Nenhum depoimento cadastrado." />
        )}
      </PageSection>

      {isAuthenticated && (
        <AdminSheet
          open={sheetOpen}
          onClose={handleSheetClose}
          title={editingTestimonial ? 'Editar depoimento' : 'Novo depoimento'}
        >
          <TestimonialForm
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
