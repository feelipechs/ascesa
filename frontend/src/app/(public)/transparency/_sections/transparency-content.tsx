'use client'

import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useDocumentCategories,
  useDocumentCategoryMutations,
} from '@/hooks/document-categories/queries'
import { useDocuments, useDocumentMutations } from '@/hooks/documents/queries'
import { DocumentsGroupedList } from './documents-grouped-list'
import { AdminSheet } from '@/components/admin/admin-sheet'
import { DocumentForm } from '@/components/admin/forms/document-form'
import { DocumentCategoryForm } from '@/components/admin/forms/document-category-form'
import { DeleteDialog } from '@/components/delete-dialog'
import { EmptyState } from '@/components/empty-state'
import type { DocumentCategory, DocumentWithCategory } from '@/types'
import { PageSection } from '@/components/page-section'
import { TransparencyFilters } from './transparency-filters'

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

  const { data: categories, isLoading: isCategoriesLoading } = useDocumentCategories()
  const { data: documentsResponse, isLoading: isDocumentsLoading } = useDocuments({ categoryId: selectedCategory })
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

  const availableYears = useMemo(() => {
    const years = new Set<number>()
    for (const doc of allDocuments) {
      if (doc.year) years.add(doc.year)
    }
    return Array.from(years).sort((a, b) => b - a)
  }, [allDocuments])

  if (isCategoriesLoading || isDocumentsLoading)
    return (
      <PageSection padding="compact">
        <div className="flex justify-end mb-6">
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>
        <div className="mb-8 flex flex-wrap gap-4 items-center">
          <Skeleton className="h-10 w-48 rounded-md" />
          <Skeleton className="h-10 w-36 rounded-md" />
        </div>
        <div className="space-y-8 md:space-y-12 lg:space-y-16">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-6">
                <Skeleton className="h-6 w-48" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-24 rounded-md" />
                  <Skeleton className="h-9 w-9 rounded-md" />
                  <Skeleton className="h-9 w-9 rounded-md" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, j) => (
                  <Skeleton key={j} className="h-40 rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </PageSection>
    )

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

  const hasNoDocuments = documents.length === 0 && !selectedCategory && !selectedYear && (categories ?? []).length === 0

  return (
    <PageSection padding="compact">
      {isAuthenticated && (
        <div className="flex justify-end mb-6">
          <Button size="sm" onClick={() => { setEditingCat(null); setCatSheetOpen(true) }}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>
      )}

      <TransparencyFilters
        categories={categories}
        availableYears={availableYears}
        selectedCategory={selectedCategory}
        selectedYear={selectedYear}
        onCategoryChange={setSelectedCategory}
        onYearChange={setSelectedYear}
      />

      {hasNoDocuments ? (
        <EmptyState title="Nenhum documento encontrado." />
      ) : (
        <DocumentsGroupedList
          categories={categories ?? []}
          groupedDocuments={groupedDocuments}
          isAuthenticated={isAuthenticated}
          onAddDocument={handleAddDocument}
          onEditDocument={handleEditDocument}
          onDeleteDocument={handleDeleteDocument}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      )}

      {isAuthenticated && (
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
      )}

      {isAuthenticated && (
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
      )}

      {isAuthenticated && (
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
      )}

      {isAuthenticated && (
        <DeleteDialog
          open={!!deletingCat}
          onClose={() => setDeletingCat(null)}
          onConfirm={() => {
            if (deletingCat)
              removeCat.mutate(deletingCat.id, { onSuccess: () => setDeletingCat(null) })
          }}
          entity="categoria"
        />
      )}

      <div className="mt-8 md:mt-12 lg:mt-16 rounded-lg border bg-muted/30 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Todos os documentos estão disponíveis para consulta pública.
        </p>
      </div>
    </PageSection>
  )
}
