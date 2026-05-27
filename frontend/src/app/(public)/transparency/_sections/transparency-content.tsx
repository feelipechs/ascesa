'use client'

import { useState, useMemo } from 'react'
import { Building, Handshake, BarChart3, Wallet, FileText, Plus } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { AdminActions } from '@/components/admin/admin-actions'
import {
  useDocumentCategories,
  useDocumentCategoryMutations,
} from '@/hooks/document-categories/queries'
import { useDocuments, useDocumentMutations } from '@/hooks/documents/queries'
import { DocumentSection } from './document-section'
import { AdminSheet } from '@/components/admin/admin-sheet'
import { DocumentForm } from '@/components/admin/forms/document-form'
import { DocumentCategoryForm } from '@/components/admin/forms/document-category-form'
import { DeleteDialog } from '@/components/delete-dialog'
import { EmptyState } from '@/components/shared/empty-state'
import type { DocumentCategory, DocumentWithCategory } from '@/types'


type TransparencyContentProps = {
  isAuthenticated?: boolean
}

export function TransparencyContent({ isAuthenticated }: TransparencyContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined)
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined)
  const [docSheetOpen, setDocSheetOpen] = useState(false)
  const [catSheetOpen, setCatSheetOpen] = useState(false)
  const [editingDoc, setEditingDoc] = useState<null | { id: string; categoryId: string }>(null)
  const [editingCat, setEditingCat] = useState<null | { id: string }>(null)
  const [addDocCategoryId, setAddDocCategoryId] = useState<string | undefined>(undefined)
  const [deletingDoc, setDeletingDoc] = useState<null | { id: string }>(null)
  const [deletingCat, setDeletingCat] = useState<null | DocumentCategory>(null)

  const { data: categories } = useDocumentCategories()
  const { data: documentsResponse } = useDocuments({ categoryId: selectedCategory })
  const { remove: removeDoc, isPending: isDeletingDoc } = useDocumentMutations()
  const { remove: removeCat } = useDocumentCategoryMutations()

  const allDocuments = documentsResponse?.data ?? []

  const documents = useMemo(() => {
    if (!selectedYear) return allDocuments
    return allDocuments.filter((doc) => doc.year === selectedYear)
  }, [allDocuments, selectedYear])

  const groupedDocuments = useMemo(() => {
    const grouped: Record<string, typeof documents> = {}
    for (const doc of documents) {
      const slug = doc.category.slug ?? ''
      if (!grouped[slug]) grouped[slug] = []
      grouped[slug].push(doc)
    }
    return grouped
  }, [documents])

  const categoryBySlug = useMemo(() => {
    const map: Record<string, string> = {}
    for (const cat of categories ?? []) {
      map[cat.slug] = cat.id
    }
    return map
  }, [categories])

  function handleAddDocument(categorySlug: string) {
    setAddDocCategoryId(categoryBySlug[categorySlug] ?? '')
    setEditingDoc(null)
    setDocSheetOpen(true)
  }

  function handleEditDocument(doc: DocumentWithCategory) {
    setEditingDoc({ id: doc.id, categoryId: doc.categoryId })
    setAddDocCategoryId(undefined)
    setDocSheetOpen(true)
  }

  function handleDocSheetClose() {
    setDocSheetOpen(false)
    setEditingDoc(null)
    setAddDocCategoryId(undefined)
  }

  function handleDeleteDocument(doc: DocumentWithCategory) {
    setDeletingDoc({ id: doc.id })
  }

  function handleEditCategory(cat: DocumentCategory) {
    setEditingCat({ id: cat.id })
    setCatSheetOpen(true)
  }

  function handleDeleteCategory(cat: DocumentCategory) {
    setDeletingCat(cat)
  }

  const availableYears = useMemo(() => {
    const years = new Set<number>()
    for (const doc of allDocuments) {
      if (doc.year) years.add(doc.year)
    }
    return Array.from(years).sort((a, b) => b - a)
  }, [allDocuments])

  const hasNoDocuments = documents.length === 0 && !selectedCategory && !selectedYear

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="mb-8 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4">
          <select
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm"
            value={selectedCategory ?? ''}
            onChange={(e) => setSelectedCategory(e.target.value || undefined)}
          >
            <option value="">Todas as categorias</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name} ({cat._count.documents})
              </option>
            ))}
          </select>

          <select
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm"
            value={selectedYear ?? ''}
            onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : undefined)}
          >
            <option value="">Todos os anos</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {isAuthenticated && (
          <Button
            size="sm"
            onClick={() => {
              setEditingCat(null)
              setCatSheetOpen(true)
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova categoria
          </Button>
        )}
      </div>

      {hasNoDocuments ? (
        <EmptyState title="Nenhum documento encontrado." />
      ) : (
        <div className="space-y-16">
          {(categories ?? []).map((category, index) => (
            <div key={category.id}>
              {index > 0 && <Separator className="mb-16" />}
              <DocumentSection
                icon={<FileText className="h-5 w-5" />}
                title={category.name}
                description=''
                documents={groupedDocuments[category.slug] ?? []}
                isAuthenticated={isAuthenticated}
                onAdd={() => handleAddDocument(category.slug)}
                onEdit={handleEditDocument}
                onDelete={handleDeleteDocument}
                onEditCategory={() => handleEditCategory(category)}
                onDeleteCategory={() => handleDeleteCategory(category)}
              />
            </div>
          ))}
        </div>
      )}

      <AdminSheet
        open={docSheetOpen}
        onClose={handleDocSheetClose}
        title={editingDoc ? 'Editar documento' : 'Novo documento'}
      >
        <DocumentForm
          documentId={editingDoc?.id}
          defaultCategoryId={editingDoc?.categoryId ?? addDocCategoryId}
          onSuccess={handleDocSheetClose}
          onCancel={handleDocSheetClose}
        />
      </AdminSheet>

      <AdminSheet
        open={catSheetOpen}
        onClose={() => setCatSheetOpen(false)}
        title={editingCat ? 'Editar categoria' : 'Nova categoria'}
      >
        <DocumentCategoryForm
          categoryId={editingCat?.id}
          onSuccess={() => setCatSheetOpen(false)}
          onCancel={() => setCatSheetOpen(false)}
        />
      </AdminSheet>

      <DeleteDialog
        open={!!deletingDoc}
        onClose={() => setDeletingDoc(null)}
        onConfirm={() => {
          if (deletingDoc)
            removeDoc.mutate(deletingDoc.id, { onSuccess: () => setDeletingDoc(null) })
        }}
        isPending={isDeletingDoc}
        entity="documento"
      />

      <DeleteDialog
        open={!!deletingCat}
        onClose={() => setDeletingCat(null)}
        onConfirm={() => {
          if (deletingCat)
            removeCat.mutate(deletingCat.id, { onSuccess: () => setDeletingCat(null) })
        }}
        entity="categoria"
      />

      <div className="mt-16 rounded-lg border bg-muted/30 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Todos os documentos estão disponíveis para consulta pública.
        </p>
      </div>
    </div>
  )
}
