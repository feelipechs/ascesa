'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageSection } from '@/components/page-section'
import { AnimalCard } from './animal-card'
import { AnimalsFilters } from './animals-filters'
import { SharedPagination } from '@/components/pagination'
import { AdminSheet } from '@/components/admin/admin-sheet'
import { AnimalForm } from '@/components/admin/forms/animal-form'
import { useAnimals, useAnimalMutations } from '@/hooks/animals/queries'
import { useAnimalsFilter } from '@/hooks/use-animals-filter'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/empty-state'
import { DeleteDialog } from '@/components/delete-dialog'
import { getPageNumbers } from '@/lib/utils'

type AnimalsContentProps = {
  isAuthenticated?: boolean
}

export function AnimalsContent({ isAuthenticated }: AnimalsContentProps) {
  const {
    searchQuery,
    selectedSpecies,
    selectedSize,
    selectedStatus,
    currentPage,
    filters,
    handleSearchChange,
    handleSpeciesChange,
    handleSizeChange,
    handleStatusChange,
    handlePageChange,
  } = useAnimalsFilter()

  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingAnimal, setEditingAnimal] = useState<null | { slug: string }>(null)
  const [deletingAnimal, setDeletingAnimal] = useState<null | { slug: string }>(null)

  const { data, isLoading } = useAnimals(filters)
  const { remove, isPending } = useAnimalMutations()
  const animals = data?.data ?? []
  const totalPages = data?.meta.totalPages ?? 1

  function handleNew() {
    setEditingAnimal(null)
    setSheetOpen(true)
  }

  function handleEdit(animal: { slug: string }) {
    setEditingAnimal(animal)
    setSheetOpen(true)
  }

  function handleSheetClose() {
    setSheetOpen(false)
    setEditingAnimal(null)
  }

  return (
    <>
      <PageSection padding="compact">
        <div className="space-y-6">
          {isAuthenticated && (
            <div className="flex justify-end gap-2">
              <Button size="sm" onClick={handleNew}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>
          )}

          <AnimalsFilters
            searchQuery={searchQuery}
            selectedSpecies={selectedSpecies}
            selectedSize={selectedSize}
            selectedStatus={selectedStatus}
            onSearchChange={handleSearchChange}
            onSpeciesChange={handleSpeciesChange}
            onSizeChange={handleSizeChange}
            onStatusChange={handleStatusChange}
          />

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[4/3] rounded-lg" />
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : animals.length === 0 ? (
            <EmptyState title="Nenhum animal encontrado." description="Tente ajustar os filtros." />
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {animals.map((animal) => (
                  <AnimalCard
                    key={animal.id}
                    animal={animal}
                    isAuthenticated={isAuthenticated}
                    onEdit={() => handleEdit({ slug: animal.slug })}
                    onDelete={() => setDeletingAnimal({ slug: animal.slug })}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8">
                  <SharedPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageNumbers={getPageNumbers(currentPage, totalPages)}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </PageSection>

      {isAuthenticated && (
        <AdminSheet
          open={sheetOpen}
          onClose={handleSheetClose}
          title={editingAnimal ? 'Editar animal' : 'Novo animal'}
        >
        <AnimalForm
          key={editingAnimal?.slug ?? 'new'}
          animalSlug={editingAnimal?.slug}
          onSuccess={handleSheetClose}
          onCancel={handleSheetClose}
        />
        </AdminSheet>
      )}

      {isAuthenticated && (
        <DeleteDialog
          open={!!deletingAnimal}
          onClose={() => setDeletingAnimal(null)}
          onConfirm={() => {
            if (deletingAnimal)
              remove.mutate(deletingAnimal.slug, { onSuccess: () => setDeletingAnimal(null) })
          }}
          isPending={isPending}
          entity="animal"
        />
      )}

    </>
  )
}
