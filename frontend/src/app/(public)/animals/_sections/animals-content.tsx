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
import { AdminActions } from '@/components/admin/admin-actions'
import { useAnimals, useAnimalMutations } from '@/hooks/animals/queries'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/empty-state'
import { DeleteDialog } from '@/components/delete-dialog'
import { getPageNumbers } from '@/lib/utils'

type AnimalsContentProps = {
  isAuthenticated?: boolean
}

export function AnimalsContent({ isAuthenticated }: AnimalsContentProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecies, setSelectedSpecies] = useState('all')
  const [selectedSize, setSelectedSize] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingAnimal, setEditingAnimal] = useState<null | { slug: string }>(null)
  const [deletingAnimal, setDeletingAnimal] = useState<null | { slug: string }>(null)

  const filters: Record<string, string | undefined> = {
    ...(searchQuery && { search: searchQuery }),
    ...(selectedSpecies !== 'all' && { speciesId: selectedSpecies }),
    ...(selectedSize !== 'all' && { sizeId: selectedSize }),
    ...(selectedStatus !== 'all' && { status: selectedStatus }),
    page: String(currentPage),
  }

  const { data, isLoading } = useAnimals(filters)
  const { remove, isPending } = useAnimalMutations()
  const animals = data?.data ?? []
  const totalPages = data?.meta.totalPages ?? 1

  function handleFilterChange() {
    setCurrentPage(1)
  }

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
            <div className="flex justify-end">
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
            onSearchChange={(v) => { setSearchQuery(v); handleFilterChange() }}
            onSpeciesChange={(v) => { setSelectedSpecies(v); handleFilterChange() }}
            onSizeChange={(v) => { setSelectedSize(v); handleFilterChange() }}
            onStatusChange={(v) => { setSelectedStatus(v); handleFilterChange() }}
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
                  <div key={animal.id} className="group relative">
                    {isAuthenticated && (
                      <div className="absolute top-2 right-2 z-10">
                        <AdminActions
                          onEdit={() => handleEdit({ slug: animal.slug })}
                          onDelete={() => setDeletingAnimal({ slug: animal.slug })}
                        />
                      </div>
                    )}
                    <AnimalCard animal={animal} />
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <SharedPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageNumbers={getPageNumbers(currentPage, totalPages)}
                  onPageChange={setCurrentPage}
                />
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
            animal={editingAnimal as Record<string, unknown> | undefined}
            onSuccess={handleSheetClose}
            onCancel={handleSheetClose}
          />
        </AdminSheet>
      )}

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
    </>
  )
}
