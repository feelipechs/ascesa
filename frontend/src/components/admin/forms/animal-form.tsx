'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createAnimalSchema, updateAnimalSchema } from '@/schemas/animal.schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAnimalMutations, animalQueryOptions } from '@/hooks/animals/queries'
import { useQuery } from '@tanstack/react-query'
import { AnimalGender, AnimalStatus, AnimalSpecies, AnimalSize, AnimalAgeRange } from '@/generated/prisma/enums'
import { toDateInput } from '@/lib/utils-date'
import { ImageUploadField } from './fields/image-upload-field'
import { speciesOptions, sizeOptions, ageRangeOptions } from '@/lib/animal-labels'
import { Skeleton } from '@/components/ui/skeleton'
import type { AnimalWithDetails } from '@/types'

type AnimalData = AnimalWithDetails

type AnimalFormProps = {
  animalSlug?: string
  onSuccess: () => void
  onCancel: () => void
}

export function AnimalForm({ animalSlug, onSuccess, onCancel }: AnimalFormProps) {
  const isEditing = !!animalSlug
  const { data: animalData, isLoading } = useQuery(animalQueryOptions(animalSlug))

  if (isEditing && isLoading) {
    return <Skeleton className="h-96 w-full" />
  }

  if (isEditing && !animalData) {
    return null
  }

  return (
    <AnimalFormInner
      animalSlug={animalSlug}
      animalData={animalData as AnimalData | undefined}
      onSuccess={onSuccess}
      onCancel={onCancel}
    />
  )
}

type AnimalFormInnerProps = {
  animalSlug?: string
  animalData?: AnimalData
  onSuccess: () => void
  onCancel: () => void
}

function AnimalFormInner({ animalSlug, animalData, onSuccess, onCancel }: AnimalFormInnerProps) {
  const isEditing = !!animalSlug
  const { create, update, isPending } = useAnimalMutations()

  const form = useForm({
    resolver: zodResolver(isEditing ? updateAnimalSchema : createAnimalSchema),
    defaultValues: {
      name: animalData?.name ?? '',
      slug: animalData?.slug ?? '',
      coverMediaId: animalData?.coverMedia?.id ?? '',
      species: animalData?.species ?? '',
      breed: animalData?.breed ?? '',
      gender: animalData?.gender ?? '',
      size: animalData?.size ?? '',
      birthDate: animalData?.birthDate ? toDateInput(animalData.birthDate) : '',
      ageRange: animalData?.ageRange ?? '',
      description: animalData?.description ?? '',
      content: animalData?.content ?? '',
      status: animalData?.status ?? '',
      featured: animalData?.featured ?? false,
    } as any, // eslint-disable-line @typescript-eslint/no-explicit-any -- RHF infers types from Zod schema, but we need '' for empty Select placeholder
  })

  function autoSlug(name: string) {
    if (!isEditing) form.setValue('slug', name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
  }

  function handleSubmit(rawData: Record<string, unknown>) {
    const payload: Record<string, unknown> = {
      name: rawData.name,
      slug: rawData.slug,
      species: rawData.species || null,
      gender: rawData.gender,
      breed: rawData.breed || null,
      size: rawData.size || null,
      ageRange: rawData.ageRange || null,
      birthDate: rawData.birthDate || null,
      description: rawData.description || null,
      content: rawData.content || null,
      status: rawData.status,
      featured: rawData.featured,
      coverMediaId: rawData.coverMediaId || null,
    }
    if (isEditing && animalSlug) {
      update.mutate({ slug: animalSlug, data: payload }, { onSuccess })
    } else {
      create.mutate(payload, { onSuccess })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" {...form.register('name')} onChange={(e) => { form.register('name').onChange(e); autoSlug(e.target.value) }} required placeholder="Rex" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...form.register('slug')} required placeholder="rex" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="species">Espécie</Label>
          <Controller
            control={form.control}
            name="species"
            render={({ field }) => (
              <Select value={field.value} onValueChange={(v) => field.onChange(v as AnimalSpecies)} required>
                <SelectTrigger id="species"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {speciesOptions.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="gender">Sexo</Label>
          <Controller
            control={form.control}
          name="gender"
          render={({ field }) => (
            <Select value={field.value ?? ''} onValueChange={(v) => field.onChange(v as AnimalGender)} required>
                <SelectTrigger id="gender"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={AnimalGender.MALE}>Macho</SelectItem>
                  <SelectItem value={AnimalGender.FEMALE}>Fêmea</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="breed">Raça (opcional)</Label>
        <Input id="breed" {...form.register('breed')} placeholder="SRD" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="size">Porte</Label>
          <Controller
            control={form.control}
            name="size"
            render={({ field }) => (
              <Select value={field.value ?? ''} onValueChange={(v) => field.onChange(v as AnimalSize)}>
                <SelectTrigger id="size"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {sizeOptions.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="ageRange">Faixa etária</Label>
          <Controller
            control={form.control}
            name="ageRange"
            render={({ field }) => (
              <Select value={field.value ?? ''} onValueChange={(v) => field.onChange(v as AnimalAgeRange)}>
                <SelectTrigger id="ageRange"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {ageRangeOptions.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="birthDate">Data de nascimento</Label>
          <Input id="birthDate" type="date" {...form.register('birthDate')} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="status">Status</Label>
          <Controller
            control={form.control}
          name="status"
          render={({ field }) => (
            <Select value={field.value ?? ''} onValueChange={(v) => field.onChange(v as AnimalStatus)} required>
                <SelectTrigger id="status"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={AnimalStatus.AVAILABLE}>Disponível</SelectItem>
                  <SelectItem value={AnimalStatus.ADOPTED}>Adotado</SelectItem>
                  <SelectItem value={AnimalStatus.FOSTERED}>Lar Temporário</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <Controller
        control={form.control}
        name="coverMediaId"
        render={({ field }) => (
          <ImageUploadField
            mediaId={field.value ?? ''}
            url={animalData?.coverMedia?.url ?? null}
            onChange={(mediaId) => field.onChange(mediaId)}
            onRemove={() => field.onChange('')}
            label="Foto principal"
          />
        )}
      />

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Descrição (card)</Label>
        <Textarea id="description" {...form.register('description')} placeholder="Resumo para o card" rows={2} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="content">História completa</Label>
        <Textarea id="content" {...form.register('content')} placeholder="História completa do animal" rows={4} />
      </div>

      <div className="flex items-center gap-4">
        <Controller
          control={form.control}
          name="featured"
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Switch id="featured" checked={field.value ?? false} onCheckedChange={field.onChange} />
              <Label htmlFor="featured">Destaque</Label>
            </div>
          )}
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancelar</Button>
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Adicionar animal'}
        </Button>
      </div>
    </form>
  )
}
