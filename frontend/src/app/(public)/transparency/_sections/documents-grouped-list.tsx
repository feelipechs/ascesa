'use client'

import { FileText } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { DocumentSection } from './document-section'
import type { DocumentCategory, DocumentWithCategory } from '@/types'

type DocumentsGroupedListProps = {
  categories: DocumentCategory[]
  groupedDocuments: Record<string, DocumentWithCategory[]>
  isAuthenticated?: boolean
  onAddDocument: (categorySlug: string) => void
  onEditDocument: (doc: DocumentWithCategory) => void
  onDeleteDocument: (doc: DocumentWithCategory) => void
  onEditCategory: (cat: DocumentCategory) => void
  onDeleteCategory: (cat: DocumentCategory) => void
}

export function DocumentsGroupedList({
  categories,
  groupedDocuments,
  isAuthenticated,
  onAddDocument,
  onEditDocument,
  onDeleteDocument,
  onEditCategory,
  onDeleteCategory,
}: DocumentsGroupedListProps) {
  return (
    <div className="space-y-8 md:space-y-12 lg:space-y-16">
      {categories.map((category, index) => (
        <div key={category.id}>
          {index > 0 && <Separator className="mb-8 md:mb-12 lg:mb-16" />}
          <DocumentSection
            icon={<FileText className="h-5 w-5" />}
            title={category.name}
            description=""
            documents={groupedDocuments[category.slug] ?? []}
            isAuthenticated={isAuthenticated}
            onAdd={() => onAddDocument(category.slug)}
            onEdit={onEditDocument}
            onDelete={onDeleteDocument}
            onEditCategory={() => onEditCategory(category)}
            onDeleteCategory={() => onDeleteCategory(category)}
          />
        </div>
      ))}
    </div>
  )
}
