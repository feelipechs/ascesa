'use client'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProjectsGrid } from './projects-grid'
import { ProjectsFilters } from './projects-filters'
import { SharedPagination } from '@/components/pagination'
import { useProjectsFilter } from '@/hooks/use-projects-filter'
import { useProjectMutations, useProjects } from '@/hooks/projects/queries'
import { AdminSheet } from '@/components/admin/admin-sheet'
import { ProjectForm } from '@/components/admin/forms/project-form'
import { getPageNumbers } from '@/lib/utils'
import { DeleteDialog } from '@/components/delete-dialog'

export function ProjectsContent({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<null | { id: string }>(null)
  const [deletingProject, setDeletingProject] = useState<null | { id: string }>(null)
  const { remove, isPending } = useProjectMutations()

  const {
    searchQuery,
    selectedAreas,
    currentPage,
    handleSearch,
    handleAreasChange,
    handlePageChange,
  } = useProjectsFilter()

  const { data, isLoading } = useProjects({
    search: searchQuery,
    areas: selectedAreas,
    page: currentPage,
  })

  const allProjects = data?.data ?? []
  const totalPages = data?.meta.totalPages ?? 1

  function handleEdit(project: { id: string }) {
    setEditingProject(project)
    setSheetOpen(true)
  }

  function handleSheetClose() {
    setSheetOpen(false)
    setEditingProject(null)
  }

  return (
    <div className="space-y-12">
      <section>
        {isAuthenticated && (
          <div className="flex justify-end mb-6">
            <Button
              size="sm"
              onClick={() => {
                setEditingProject(null)
                setSheetOpen(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
        )}

        <ProjectsFilters
          searchQuery={searchQuery}
          selectedAreas={selectedAreas}
          onSearchChange={handleSearch}
          onAreasChange={handleAreasChange}
        />

        <div className="mt-6">
          <ProjectsGrid
            projects={allProjects}
            isLoading={isLoading}
            isAuthenticated={isAuthenticated}
            onEdit={handleEdit}
            onDelete={(project) => setDeletingProject({ id: project.id })}
          />
        </div>

        <SharedPagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageNumbers={getPageNumbers(currentPage, totalPages)}
          onPageChange={handlePageChange}
        />
      </section>

      {isAuthenticated && (
        <AdminSheet
          open={sheetOpen}
          onClose={handleSheetClose}
          title={editingProject ? 'Editar projeto' : 'Novo projeto'}
        >
          <ProjectForm
            projectId={editingProject?.id}
            onSuccess={handleSheetClose}
            onCancel={handleSheetClose}
          />
        </AdminSheet>
      )}

      <DeleteDialog
        open={!!deletingProject}
        onClose={() => setDeletingProject(null)}
        onConfirm={() => {
          if (deletingProject)
            remove.mutate(deletingProject.id, { onSuccess: () => setDeletingProject(null) })
        }}
        entity="projeto"
        description="Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita."
        isPending={isPending}
      />
    </div>
  )
}
