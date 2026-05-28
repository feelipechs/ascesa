'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { AdminSheet } from '@/components/admin/admin-sheet'
import { AnimalForm } from '@/components/admin/forms/animal-form'
import { useAnimals, useAnimalMutations } from '@/hooks/animals/queries'
import { DeleteDialog } from '@/components/delete-dialog'
import { EmptyState } from '@/components/empty-state'
import { AnimalStatus } from '@/generated/prisma/enums'

const statusLabels: Record<string, string> = {
  [AnimalStatus.AVAILABLE]: 'Disponível',
  [AnimalStatus.ADOPTED]: 'Adotado',
  [AnimalStatus.FOSTERED]: 'Lar Temporário',
}

const statusVariants: Record<string, 'default' | 'secondary' | 'outline'> = {
  [AnimalStatus.AVAILABLE]: 'default',
  [AnimalStatus.ADOPTED]: 'secondary',
  [AnimalStatus.FOSTERED]: 'outline',
}

export default function AdminAnimalsPage() {
  const router = useRouter()
  const { data, isLoading } = useAnimals({ limit: '100' })
  const { remove, isPending } = useAnimalMutations()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [deletingSlug, setDeletingSlug] = useState<null | string>(null)

  function handleSheetClose() {
    setSheetOpen(false)
  }

  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Animais</h1>
        <Button onClick={() => setSheetOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Animal
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ) : !data?.data || data.data.length === 0 ? (
        <EmptyState title="Nenhum animal cadastrado." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Espécie</TableHead>
              <TableHead>Sexo</TableHead>
              <TableHead>Porte</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Destaque</TableHead>
              <TableHead className="w-20">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data.map((animal) => (
              <TableRow
                key={animal.id}
                className="cursor-pointer"
                onClick={() => router.push(`/admin/animals/${animal.slug}`)}
              >
                <TableCell className="font-medium">{animal.name}</TableCell>
                <TableCell>{animal.species.name}</TableCell>
                <TableCell>{animal.gender === 'MALE' ? 'Macho' : 'Fêmea'}</TableCell>
                <TableCell className="text-muted-foreground">{animal.size?.label ?? '—'}</TableCell>
                <TableCell>
                  <Badge variant={statusVariants[animal.status] ?? 'outline'}>
                    {statusLabels[animal.status] ?? animal.status}
                  </Badge>
                </TableCell>
                <TableCell>{animal.featured ? 'Sim' : '—'}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); router.push(`/admin/animals/${animal.slug}`) }} className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); setDeletingSlug(animal.slug) }} className="h-8 w-8 text-destructive">
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
        title="Novo animal"
      >
        <AnimalForm onSuccess={handleSheetClose} onCancel={handleSheetClose} />
      </AdminSheet>

      <DeleteDialog
        open={!!deletingSlug}
        onClose={() => setDeletingSlug(null)}
        onConfirm={() => {
          if (deletingSlug) remove.mutate(deletingSlug, { onSuccess: () => setDeletingSlug(null) })
        }}
        isPending={isPending}
        entity="animal"
      />
    </div>
  )
}
