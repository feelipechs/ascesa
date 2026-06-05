'use client'

import type { ReactNode } from 'react'
import { AdminActions } from '@/components/admin/admin-actions'
import { SectionHeading } from '@/components/section-heading'
import { DocumentCard } from './document-card'
import { EmptyState } from '@/components/empty-state'
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
  return (
    <section>
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          {icon}
        </div>
        <SectionHeading
          title={title}
          description={description}
          action={isAuthenticated && onAdd ? { label: 'Adicionar', onClick: onAdd } : undefined}
        />
        {isAuthenticated && (onEditCategory || onDeleteCategory) && (
          <AdminActions onEdit={onEditCategory} onDelete={onDeleteCategory!} />
        )}
      </div>
      {documents.length > 0 ? (
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
      ) : (
        <EmptyState title={`Nenhum documento em "${title}".`} />
      )}
    </section>
  )
}
