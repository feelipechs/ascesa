'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import { GripVertical } from 'lucide-react'
import { SafeImage } from '@/components/safe-image'
import { AdminActions } from '@/components/admin/admin-actions'
import { AdminSheet } from '@/components/admin/admin-sheet'
import { GalleryImageForm } from '@/components/admin/forms/gallery-image-form'
import { useGalleryImages, useGalleryImageMutations } from '@/hooks/gallery-images/queries'
import { DeleteDialog } from '@/components/delete-dialog'
import { EmptyState } from '@/components/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { PageSection } from '@/components/page-section'
import { SectionHeading } from '@/components/section-heading'
import { SortableList, SortableItem } from '@/components/sortable-list'
import { useReorder } from '@/hooks/use-reorder'
import type { GalleryContext } from '@/generated/prisma/enums'

type GallerySectionProps = {
  context: GalleryContext
  foreignKey?: string
  isAuthenticated?: boolean
  title?: ReactNode
  description?: string
  wrapInPageSection?: boolean
}

export function GallerySection({
  context,
  foreignKey,
  isAuthenticated,
  title = 'Galeria',
  description,
  wrapInPageSection = false,
}: GallerySectionProps) {
  const filters: { context?: GalleryContext; projectId?: string; animalId?: string } = { context }
  if (context === 'PROJECT' && foreignKey) filters.projectId = foreignKey
  if (context === 'ANIMAL' && foreignKey) filters.animalId = foreignKey

  const { data: images = [], isLoading } = useGalleryImages(filters)
  const { remove, reorder: reorderMutation, isPending } = useGalleryImageMutations()

  const { optimisticItems, reorder, setOptimisticItems } = useReorder(images, { field: 'order' })

  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingImage, setEditingImage] = useState<null | { id: string }>(null)
  const [deletingImage, setDeletingImage] = useState<null | { id: string }>(null)

  function handleNew() {
    setEditingImage(null)
    setSheetOpen(true)
  }

  function handleEdit(image: { id: string }) {
    setEditingImage(image)
    setSheetOpen(true)
  }

  function handleSheetClose() {
    setSheetOpen(false)
    setEditingImage(null)
  }

  async function handleReorder(activeIndex: number, overIndex: number) {
    const reordered = reorder(activeIndex, overIndex)
    if (!reordered) return

    const items = reordered.map((item, i) => ({ id: item.id, order: i }))
    reorderMutation.mutate(items, {
      onError: () => setOptimisticItems(images),
    })
  }

  const headingContent = (
    <SectionHeading
      title={title}
      description={description}
      action={isAuthenticated ? { label: 'Adicionar', onClick: handleNew } : undefined}
    />
  )

  const galleryContent = isLoading ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="aspect-[3/2] rounded-lg" />
      ))}
    </div>
  ) : optimisticItems.length > 0 ? (
    isAuthenticated ? (
    <SortableList items={optimisticItems} onReorder={handleReorder}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {optimisticItems.map((image, index) => (
          <SortableItem key={image.id} id={image.id}>
            {({ attributes, listeners, isDragging }) => (
              <div
                className={`group relative aspect-[3/2] overflow-hidden rounded-lg ${isDragging ? 'opacity-50' : ''}`}
              >
                <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
                  <button
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing touch-none flex items-center justify-center h-8 w-8 rounded-md bg-background/95 backdrop-blur shadow-sm border hover:bg-muted"
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <AdminActions
                    onEdit={() => handleEdit(image)}
                    onDelete={() => setDeletingImage({ id: image.id })}
                  />
                </div>
                <SafeImage
                  src={image.media?.url}
                  alt={image.caption ?? `Foto ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            )}
          </SortableItem>
        ))}
      </div>
    </SortableList>
    ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {optimisticItems.map((image, index) => (
        <div
          key={image.id}
          className="group relative aspect-[3/2] overflow-hidden rounded-lg"
        >
          <SafeImage
            src={image.media?.url}
            alt={image.caption ?? `Foto ${index + 1}`}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      ))}
    </div>
    )
  ) : (
    <EmptyState title="Nenhuma imagem cadastrada na galeria." />
  )

  const formProps =
    context === 'PROJECT'
      ? { context, projectId: foreignKey ?? null }
      : context === 'ANIMAL'
      ? { context, animalId: foreignKey ?? null }
      : { context, projectId: null, animalId: null }

  const crudOverlay = isAuthenticated && (
    <>
      <AdminSheet
        open={sheetOpen}
        onClose={handleSheetClose}
        title={editingImage ? 'Editar imagem' : 'Nova imagem'}
      >
        <GalleryImageForm
          {...formProps}
          imageId={editingImage?.id}
          onSuccess={handleSheetClose}
          onCancel={handleSheetClose}
        />
      </AdminSheet>

      <DeleteDialog
        open={!!deletingImage}
        onClose={() => setDeletingImage(null)}
        onConfirm={() => {
          if (deletingImage)
            remove.mutate(deletingImage.id, { onSuccess: () => setDeletingImage(null) })
        }}
        isPending={isPending}
        entity="imagem"
      />
    </>
  )

  if (wrapInPageSection) {
    return (
      <>
        <PageSection borderTop width="wide" padding="compact">
          {headingContent}
          {galleryContent}
        </PageSection>
        {crudOverlay}
      </>
    )
  }

  return (
    <>
      <section>
        {headingContent}
        {galleryContent}
      </section>
      {crudOverlay}
    </>
  )
}
