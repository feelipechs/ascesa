'use client'
import { useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { useGalleryImages, useGalleryImageMutations } from '@/hooks/gallery-images/queries'
import { Gallery } from './gallery'
import { AdminSheet } from '@/components/admin/admin-sheet'
import { GalleryImageForm } from '@/components/admin/forms/gallery-image-form'
import { DeleteDialog } from '@/components/delete-dialog'
import { EmptyState } from '@/components/empty-state'
import { PageSection } from '@/components/page-section'
import { SectionHeading } from '@/components/section-heading'

type SectionBlock = {
  layout: 'left-featured' | 'right-featured' | 'grid-4' | 'grid-3' | 'grid-2' | 'single'
  images: { id: string; src: string; alt: string }[]
}

function buildSections(images: { id: string; src: string; alt: string }[]): SectionBlock[] {
  const blocks: SectionBlock[] = []
  let i = 0
  let blockIndex = 0

  while (i < images.length) {
    const remaining = images.length - i

    if (remaining >= 5) {
      blocks.push({
        layout: blockIndex % 2 === 0 ? 'left-featured' : 'right-featured',
        images: images.slice(i, i + 5),
      })
      i += 5
      blockIndex++
    } else if (remaining === 4) {
      blocks.push({ layout: 'grid-4', images: images.slice(i, i + 4) })
      i += 4
    } else if (remaining === 3) {
      blocks.push({ layout: 'grid-3', images: images.slice(i, i + 3) })
      i += 3
    } else if (remaining === 2) {
      blocks.push({ layout: 'grid-2', images: images.slice(i, i + 2) })
      i += 2
    } else {
      blocks.push({ layout: 'single', images: images.slice(i, i + 1) })
      i += 1
    }
  }
  return blocks
}

export function GalleryContent({ isAuthenticated }: { isAuthenticated?: boolean }) {
  const { data: galleryImages, isLoading } = useGalleryImages({ context: 'HOME' })
  const { remove, isPending } = useGalleryImageMutations()

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

  const sections = buildSections(
    (galleryImages ?? []).map((img) => ({ id: img.id, src: img.url, alt: img.caption ?? '' }))
  )

  if (isLoading)
    return (
      <section className="py-8 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <Skeleton className="mx-auto mb-12 h-8 w-48" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="aspect-video rounded-lg" />
            <Skeleton className="aspect-video rounded-lg" />
          </div>
        </div>
      </section>
    )

  return (
    <>
      <PageSection borderTop width="wide" padding="compact">
        <SectionHeading
          title={<>Nossa <span className="text-primary underline underline-offset-4">Galeria</span></>}
          description="Momentos que mostram o impacto do nosso trabalho nas comunidades."
          action={isAuthenticated ? { label: 'Adicionar', onClick: handleNew } : undefined}
        />

        {(galleryImages ?? []).length > 0 ? (
          <Gallery
            sections={sections}
            isAuthenticated={isAuthenticated}
            onEdit={(id) => handleEdit({ id })}
            onDelete={(id) => setDeletingImage({ id })}
          />
        ) : (
          <EmptyState title="Nenhuma imagem cadastrada na galeria." />
        )}
      </PageSection>

      {isAuthenticated && (
        <>
          <AdminSheet
            open={sheetOpen}
            onClose={handleSheetClose}
            title={editingImage ? 'Editar imagem' : 'Nova imagem'}
          >
            <GalleryImageForm
              context="HOME"
              projectId={null}
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
      )}
    </>
  )
}
