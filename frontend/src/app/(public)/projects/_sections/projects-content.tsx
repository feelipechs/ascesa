'use client'
import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
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

  const events = useMemo(() => allProjects.filter((p) => p.context === 'EVENT'), [allProjects])
  const campaigns = useMemo(() => allProjects.filter((p) => p.context === 'CAMPAIGN'), [allProjects])

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
      {isAuthenticated && (
        <div className="flex justify-end">
          <Button
            onClick={() => {
              setEditingProject(null)
              setSheetOpen(true)
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo projeto
          </Button>
        </div>
      )}

      {/* Eventos */}
      {events.length > 0 && (
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Eventos</h2>
            <p className="text-muted-foreground mt-1">Participe dos nossos eventos e ações voluntárias.</p>
          </div>
          <ProjectsGrid
            projects={events}
            isLoading={isLoading}
            isAuthenticated={isAuthenticated}
            onEdit={handleEdit}
            onDelete={(project) => setDeletingProject({ id: project.id })}
          />
        </section>
      )}

      {/* Campanhas */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Campanhas</h2>
          <p className="text-muted-foreground mt-1">Conheça nossas campanhas permanentes de apoio aos animais.</p>
        </div>

        <ProjectsFilters
          searchQuery={searchQuery}
          selectedAreas={selectedAreas}
          onSearchChange={handleSearch}
          onAreasChange={handleAreasChange}
        />

        <div className="mt-6">
          <ProjectsGrid
            projects={campaigns}
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
