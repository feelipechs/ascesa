'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { AdminSheet } from '@/components/admin/admin-sheet'
import { DeleteDialog } from '@/components/delete-dialog'
import { EmptyState } from '@/components/empty-state'
import { SortableList, SortableItem } from '@/components/sortable-list'
import { useReorder } from '@/hooks/use-reorder'
import { toast } from 'sonner'
import { AnimalSpeciesForm } from '@/components/admin/forms/animal-species-form'
import { AnimalSizeForm } from '@/components/admin/forms/animal-size-form'
import { AnimalAgeRangeForm } from '@/components/admin/forms/animal-age-range-form'
import { useAnimalSpecies, useAnimalSpeciesMutations, animalSpeciesKeys } from '@/hooks/animal-species/queries'
import { useAnimalSizes, useAnimalSizeMutations, animalSizeKeys } from '@/hooks/animal-sizes/queries'
import { useAnimalAgeRanges, useAnimalAgeRangeMutations, animalAgeRangeKeys } from '@/hooks/animal-age-ranges/queries'
import { AnimalSpeciesApi } from '@/lib/api/animal-species'
import { AnimalSizesApi } from '@/lib/api/animal-sizes'
import { AnimalAgeRangesApi } from '@/lib/api/animal-age-ranges'
import type { UseMutationResult } from '@tanstack/react-query'

type ReorderFn = (items: { id: string; order: number }[]) => Promise<void>
type InvalidateKey = { all: readonly unknown[] }

type ReferenceTabProps<TEntity> = {
  useQuery: () => { data: TEntity[] | undefined; isLoading: boolean }
  removeMutation: UseMutationResult<void, unknown, string, unknown>
  isPending: boolean
  FormComponent: React.ComponentType<{ onSuccess: () => void; onCancel: () => void; [key: string]: unknown }>
  formIdProp: string
  entityLabel: string
  emptyMessage: string
  getNameField: (entity: TEntity) => string
  reorderApi: ReorderFn
  queryKeys: InvalidateKey
}

function ReferenceTab<TEntity extends { id: string; order: number }>({
  useQuery,
  removeMutation,
  isPending,
  FormComponent,
  formIdProp,
  entityLabel,
  emptyMessage,
  getNameField,
  reorderApi,
  queryKeys,
}: ReferenceTabProps<TEntity>) {
  const { data: items, isLoading } = useQuery()
  const queryClient = useQueryClient()
  const { optimisticItems, reorder, setOptimisticItems } = useReorder(items ?? [], { field: 'order' })
  const [formSheetOpen, setFormSheetOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  function handleNew() {
    setEditingId(null)
    setFormSheetOpen(true)
  }

  function handleEdit(id: string) {
    setEditingId(id)
    setFormSheetOpen(true)
  }

  function handleFormClose() {
    setFormSheetOpen(false)
    setEditingId(null)
  }

  async function handleReorder(activeIndex: number, overIndex: number) {
    const reordered = reorder(activeIndex, overIndex)
    if (!reordered) return

    const reorderItems = reordered.map((item, i) => ({ id: item.id, order: i }))
    try {
      await reorderApi(reorderItems)
      queryClient.invalidateQueries({ queryKey: queryKeys.all })
    } catch {
      toast.error('Falha ao reordenar')
      setOptimisticItems(items ?? [])
    }
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={handleNew}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ) : !items || items.length === 0 ? (
        <EmptyState title={emptyMessage} />
      ) : (
        <SortableList items={optimisticItems} onReorder={handleReorder}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10" />
                <TableHead>Nome</TableHead>
                <TableHead className="w-20">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {optimisticItems.map((item) => (
                <SortableItem key={item.id} id={item.id}>
                  {({ attributes, listeners, isDragging }) => (
                    <TableRow className={isDragging ? 'opacity-50' : ''}>
                      <TableCell>
                        <button
                          {...attributes}
                          {...listeners}
                          className="cursor-grab active:cursor-grabbing touch-none flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted"
                        >
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </TableCell>
                      <TableCell className="font-medium">{getNameField(item)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button size="icon" variant="ghost" onClick={() => handleEdit(item.id)} className="h-8 w-8">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => setDeletingId(item.id)} className="h-8 w-8 text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </SortableItem>
              ))}
            </TableBody>
          </Table>
        </SortableList>
      )}

      <AdminSheet
        open={formSheetOpen}
        onClose={handleFormClose}
        title={editingId ? `Editar ${entityLabel}` : `Nov${entityLabel.startsWith('f') ? 'a' : 'o'} ${entityLabel}`}
      >
        <FormComponent
          {...{ [formIdProp]: editingId ?? undefined }}
          onSuccess={handleFormClose}
          onCancel={handleFormClose}
        />
      </AdminSheet>

      <DeleteDialog
        open={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) removeMutation.mutate(deletingId, { onSuccess: () => setDeletingId(null) })
        }}
        isPending={isPending}
        entity={entityLabel}
      />
    </>
  )
}

type AnimalSettingsSheetProps = {
  open: boolean
  onClose: () => void
}

export function AnimalSettingsSheet({ open, onClose }: AnimalSettingsSheetProps) {
  return (
    <AdminSheet open={open} onClose={onClose} title="Configurações">
      <Tabs defaultValue="species">
        <TabsList>
          <TabsTrigger value="species">Espécies</TabsTrigger>
          <TabsTrigger value="sizes">Portes</TabsTrigger>
          <TabsTrigger value="age-ranges">Faixas Etárias</TabsTrigger>
        </TabsList>
        <TabsContent value="species">
          <SpeciesTab />
        </TabsContent>
        <TabsContent value="sizes">
          <SizesTab />
        </TabsContent>
        <TabsContent value="age-ranges">
          <AgeRangesTab />
        </TabsContent>
      </Tabs>
    </AdminSheet>
  )
}

function SpeciesTab() {
  const { data, isLoading } = useAnimalSpecies()
  const { remove, isPending } = useAnimalSpeciesMutations()
  return (
    <ReferenceTab
      useQuery={() => ({ data, isLoading })}
      removeMutation={remove}
      isPending={isPending}
      FormComponent={AnimalSpeciesForm}
      formIdProp="speciesId"
      entityLabel="espécie"
      emptyMessage="Nenhuma espécie cadastrada."
      getNameField={(s) => s.name}
      reorderApi={AnimalSpeciesApi.reorder.bind(AnimalSpeciesApi)}
      queryKeys={animalSpeciesKeys}
    />
  )
}

function SizesTab() {
  const { data, isLoading } = useAnimalSizes()
  const { remove, isPending } = useAnimalSizeMutations()
  return (
    <ReferenceTab
      useQuery={() => ({ data, isLoading })}
      removeMutation={remove}
      isPending={isPending}
      FormComponent={AnimalSizeForm}
      formIdProp="sizeId"
      entityLabel="porte"
      emptyMessage="Nenhum porte cadastrado."
      getNameField={(s) => s.label}
      reorderApi={AnimalSizesApi.reorder.bind(AnimalSizesApi)}
      queryKeys={animalSizeKeys}
    />
  )
}

function AgeRangesTab() {
  const { data, isLoading } = useAnimalAgeRanges()
  const { remove, isPending } = useAnimalAgeRangeMutations()
  return (
    <ReferenceTab
      useQuery={() => ({ data, isLoading })}
      removeMutation={remove}
      isPending={isPending}
      FormComponent={AnimalAgeRangeForm}
      formIdProp="rangeId"
      entityLabel="faixa etária"
      emptyMessage="Nenhuma faixa etária cadastrada."
      getNameField={(r) => r.label}
      reorderApi={AnimalAgeRangesApi.reorder.bind(AnimalAgeRangesApi)}
      queryKeys={animalAgeRangeKeys}
    />
  )
}
