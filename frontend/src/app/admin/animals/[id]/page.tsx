'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { AdminSheet } from '@/components/admin/admin-sheet'
import { AnimalForm } from '@/components/admin/forms/animal-form'
import { animalQueryOptions, useAnimalMutations } from '@/hooks/animals/queries'
import { useQuery } from '@tanstack/react-query'
import { DeleteDialog } from '@/components/delete-dialog'
import { AnimalStatus } from '@/generated/prisma/enums'
import { SafeImage } from '@/components/safe-image'

type Props = { params: Promise<{ slug: string }> }

const statusLabels: Record<string, string> = {
  [AnimalStatus.AVAILABLE]: 'Disponível',
  [AnimalStatus.ADOPTED]: 'Adotado',
  [AnimalStatus.FOSTERED]: 'Lar Temporário',
}

export default function AdminAnimalDetailPage({ params }: Props) {
  const { slug } = use(params)
  const router = useRouter()
  const { data: animal, isLoading } = useQuery(animalQueryOptions(slug))
  const { update, remove, isPending } = useAnimalMutations()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (isLoading) {
    return (
      <div className="px-4 lg:px-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    )
  }

  if (!animal) {
    return (
      <div className="px-4 lg:px-6">
        <p className="text-muted-foreground">Animal não encontrado.</p>
        <Button variant="outline" onClick={() => router.push('/admin/animals')}>Voltar</Button>
      </div>
    )
  }

  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/admin/animals')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold">{animal.name}</h1>
          <Badge variant={animal.status === AnimalStatus.AVAILABLE ? 'default' : 'secondary'}>
            {statusLabels[animal.status] ?? animal.status}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setSheetOpen(true)}>
            <Pencil className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button variant="destructive" onClick={() => setConfirmDelete(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>

      {animal.coverUrl && (
        <SafeImage src={animal.coverUrl} alt={animal.name} className="w-full h-64 object-cover rounded-lg" />
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Espécie</p>
          <p className="font-medium">{animal.species.name}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Sexo</p>
          <p className="font-medium">{animal.gender === 'MALE' ? 'Macho' : 'Fêmea'}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Porte</p>
          <p className="font-medium">{animal.size?.label ?? '—'}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Faixa etária</p>
          <p className="font-medium">{animal.ageRange?.label ?? '—'}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Raça</p>
          <p className="font-medium">{animal.breed ?? '—'}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Data de nascimento</p>
          <p className="font-medium">{animal.birthDate ? new Date(animal.birthDate).toLocaleDateString('pt-BR') : '—'}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">No abrigo desde</p>
          <p className="font-medium">{new Date(animal.shelterSince).toLocaleDateString('pt-BR')}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Destaque</p>
          <p className="font-medium">{animal.featured ? 'Sim' : 'Não'}</p>
        </div>
      </div>

      {animal.description && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Descrição</h2>
          <p>{animal.description}</p>
        </div>
      )}

      {animal.content && (
        <div>
          <h2 className="text-lg font-semibold mb-2">História</h2>
          <p className="whitespace-pre-wrap">{animal.content}</p>
        </div>
      )}

      <AdminSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Editar animal">
        <AnimalForm animalSlug={slug} onSuccess={() => setSheetOpen(false)} onCancel={() => setSheetOpen(false)} />
      </AdminSheet>

      <DeleteDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => {
          remove.mutate(slug, { onSuccess: () => router.push('/admin/animals') })
        }}
        isPending={isPending}
        entity="animal"
      />
    </div>
  )
}
