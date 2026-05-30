'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { SafeImage } from '@/components/safe-image'
import { AdminActions } from '@/components/admin/admin-actions'
import { AdminSheet } from '@/components/admin/admin-sheet'
import { GalleryImageForm } from '@/components/admin/forms/gallery-image-form'
import { useGalleryImages, useGalleryImageMutations } from '@/hooks/gallery-images/queries'
import { DeleteDialog } from '@/components/delete-dialog'
import { EmptyState } from '@/components/empty-state'

type AnimalGallerySectionProps = {
  animalId: string
  isAuthenticated?: boolean
}

export function AnimalGallerySection({ animalId, isAuthenticated }: AnimalGallerySectionProps) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingImage, setEditingImage] = useState<null | { id: string }>(null)
  const [deletingImage, setDeletingImage] = useState<null | { id: string }>(null)
  const { data: images = [] } = useGalleryImages({ context: 'ANIMAL', animalId })
  const { remove, isPending } = useGalleryImageMutations()

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

  return (
    <>
      <Separator />
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-foreground">Galeria</h2>
          {isAuthenticated && (
            <Button size="sm" onClick={handleNew}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          )}
        </div>

        {images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="group relative aspect-[3/2] overflow-hidden rounded-lg"
              >
                {isAuthenticated && (
                  <div className="absolute top-2 right-2 z-10">
                    <AdminActions
                      onEdit={() => handleEdit(image)}
                      onDelete={() => setDeletingImage({ id: image.id })}
                    />
                  </div>
                )}
                <SafeImage
                  src={image.url}
                  alt={image.caption ?? `Foto ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="Nenhuma imagem cadastrada na galeria." />
        )}
      </section>

      {isAuthenticated && (
        <AdminSheet
          open={sheetOpen}
          onClose={handleSheetClose}
          title={editingImage ? 'Editar imagem' : 'Nova imagem'}
        >
          <GalleryImageForm
            context="ANIMAL"
            animalId={animalId}
            imageId={editingImage?.id}
            onSuccess={handleSheetClose}
            onCancel={handleSheetClose}
          />
        </AdminSheet>
      )}

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
}
