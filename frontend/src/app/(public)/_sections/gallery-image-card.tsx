'use client'

import { SafeImage } from '@/components/safe-image'
import { AdminActions } from '@/components/admin/admin-actions'

type GalleryImageCardProps = {
  src: string
  alt: string
  isAuthenticated?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

export function GalleryImageCard({ src, alt, isAuthenticated, onEdit, onDelete }: GalleryImageCardProps) {
  return (
    <div className="group relative h-full w-full">
      {isAuthenticated && onEdit && onDelete && (
        <div className="absolute top-2 right-2 z-10">
          <AdminActions onEdit={onEdit} onDelete={onDelete} />
        </div>
      )}
      <SafeImage src={src} alt={alt} fill className="rounded-lg object-cover" />
    </div>
  )
}
