'use client'

import type { ReactNode } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminActions } from '@/components/admin/admin-actions'
import { DocumentCard } from './document-card'
import type { DocumentWithCategory } from '@/types'

type DocumentSectionProps = {
  icon: ReactNode
  title: string
  description: string
  documents: DocumentWithCategory[]
  isAuthenticated?: boolean
  onAdd?: () => void
  onEdit?: (doc: DocumentWithCategory) => void
  onDelete?: (doc: DocumentWithCategory) => void
  onEditCategory?: () => void
  onDeleteCategory?: () => void
}

export function DocumentSection({
  icon,
  title,
  description,
  documents,
  isAuthenticated,
  onAdd,
  onEdit,
  onDelete,
  onEditCategory,
  onDeleteCategory,
}: DocumentSectionProps) {
  if (documents.length === 0 && !isAuthenticated) return null

  return (
    <section>
      <div className="mb-6">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              {icon}
            </div>
            <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated && onAdd && (
              <Button size="sm" onClick={onAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            )}
            {isAuthenticated && (onEditCategory || onDeleteCategory) && (
              <AdminActions onEdit={onEditCategory} onDelete={onDeleteCategory!} />
            )}
          </div>
        </div>
        {description && <p className="text-muted-foreground ml-13">{description}</p>}
      </div>
      {documents.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in-0 duration-500">
          {documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              isAuthenticated={isAuthenticated}
              onEdit={() => onEdit?.(doc)}
              onDelete={() => onDelete?.(doc)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
