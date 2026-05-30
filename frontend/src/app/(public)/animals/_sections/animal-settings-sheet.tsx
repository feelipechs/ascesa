'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { AdminSheet } from '@/components/admin/admin-sheet'
import { DeleteDialog } from '@/components/delete-dialog'
import { EmptyState } from '@/components/empty-state'
import { AnimalSpeciesForm } from '@/components/admin/forms/animal-species-form'
import { AnimalSizeForm } from '@/components/admin/forms/animal-size-form'
import { AnimalAgeRangeForm } from '@/components/admin/forms/animal-age-range-form'
import { useAnimalSpecies, useAnimalSpeciesMutations } from '@/hooks/animal-species/queries'
import { useAnimalSizes, useAnimalSizeMutations } from '@/hooks/animal-sizes/queries'
import { useAnimalAgeRanges, useAnimalAgeRangeMutations } from '@/hooks/animal-age-ranges/queries'
import type { UseMutationResult } from '@tanstack/react-query'

type ReferenceTabProps<TEntity> = {
  useQuery: () => { data: TEntity[] | undefined; isLoading: boolean }
  removeMutation: UseMutationResult<void, unknown, string, unknown>
  isPending: boolean
  FormComponent: React.ComponentType<{ onSuccess: () => void; onCancel: () => void; [key: string]: unknown }>
  formIdProp: string
  entityLabel: string
  emptyMessage: string
  getNameField: (entity: TEntity) => string
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
}: ReferenceTabProps<TEntity>) {
  const { data: items, isLoading } = useQuery()
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Ordem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead className="w-20">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="text-muted-foreground text-sm">{item.order}</TableCell>
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
            ))}
          </TableBody>
        </Table>
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
    />
  )
}
