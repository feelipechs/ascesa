'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { AdminSheet } from '@/components/admin/admin-sheet'
import { ProjectForm } from '@/components/admin/forms/project-form'
import { useProjects, useProjectMutations } from '@/hooks/projects/queries'
import { DeleteDialog } from '@/components/delete-dialog'
import { EmptyState } from '@/components/shared/empty-state'

export default function AdminProjectsPage() {
  const { data, isLoading } = useProjects()
  const { remove, isPending } = useProjectMutations()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<null | { id: string }>(null)
  const [deletingProject, setDeletingProject] = useState<null | { id: string }>(null)

  const projects = data?.data ?? []

  function handleNew() {
    setEditingProject(null)
    setSheetOpen(true)
  }

  function handleEdit(project: { id: string }) {
    setEditingProject(project)
    setSheetOpen(true)
  }

  function handleSheetClose() {
    setSheetOpen(false)
    setEditingProject(null)
  }

  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projetos</h1>
        <Button onClick={handleNew}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ) : !projects || projects.length === 0 ? (
        <EmptyState title="Nenhum projeto encontrado." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Área</TableHead>
              <TableHead>Destaque</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="w-20">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.title}</TableCell>
                <TableCell>
                  <Badge variant={project.context === 'EVENT' ? 'default' : 'secondary'}>
                    {project.context === 'EVENT' ? 'Evento' : 'Campanha'}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{(project as { area?: { title: string } }).area?.title}</TableCell>
                <TableCell>{project.featured ? '⭐' : '—'}</TableCell>
                <TableCell className="text-muted-foreground">
                  {format(project.createdAt, 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(project)} className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setDeletingProject({ id: project.id })} className="h-8 w-8 text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

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

      <DeleteDialog
        open={!!deletingProject}
        onClose={() => setDeletingProject(null)}
        onConfirm={() => {
          if (deletingProject)
            remove.mutate(deletingProject.id, { onSuccess: () => setDeletingProject(null) })
        }}
        isPending={isPending}
        entity="projeto"
      />
    </div>
  )
}
