'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createAnimalSchema } from '@/schemas/animal.schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAnimalMutations } from '@/hooks/animals/queries'
import { useAnimalSpecies } from '@/hooks/animal-species/queries'
import { useAnimalSizes } from '@/hooks/animal-sizes/queries'
import { useAnimalAgeRanges } from '@/hooks/animal-age-ranges/queries'
import { AnimalGender, AnimalStatus } from '@/generated/prisma/enums'

type AnimalFormProps = {
  animal?: Record<string, unknown>
  onSuccess: () => void
  onCancel: () => void
}

export function AnimalForm({ animal, onSuccess, onCancel }: AnimalFormProps) {
  const isEditing = !!animal
  const { create, update, isPending } = useAnimalMutations()
  const { data: species } = useAnimalSpecies()
  const { data: sizes } = useAnimalSizes()
  const { data: ageRanges } = useAnimalAgeRanges()

  const form = useForm({
    resolver: zodResolver(createAnimalSchema),
    defaultValues: {
      name: '',
      slug: '',
      speciesId: '',
      breed: '',
      gender: AnimalGender.MALE as 'MALE' | 'FEMALE',
      sizeId: '',
      birthDate: '',
      ageRangeId: '',
      description: '',
      content: '',
      coverUrl: '',
      status: AnimalStatus.AVAILABLE as 'AVAILABLE' | 'ADOPTED' | 'FOSTERED',
      featured: false,
      publishedAt: '',
    },
  })

  useEffect(() => {
    if (!animal) return
    form.reset({
      name: (animal.name as string) ?? '',
      slug: (animal.slug as string) ?? '',
      speciesId: (animal.speciesId as string) ?? '',
      breed: (animal.breed as string) ?? '',
      gender: ((animal.gender as string) || 'MALE') as 'MALE' | 'FEMALE',
      sizeId: (animal.sizeId as string) ?? '',
      birthDate: animal.birthDate ? new Date(animal.birthDate as string).toISOString().split('T')[0] : '',
      ageRangeId: (animal.ageRangeId as string) ?? '',
      description: (animal.description as string) ?? '',
      content: (animal.content as string) ?? '',
      coverUrl: (animal.coverUrl as string) ?? '',
      status: ((animal.status as string) || 'AVAILABLE') as 'AVAILABLE' | 'ADOPTED' | 'FOSTERED',
      featured: (animal.featured as boolean) ?? false,
      publishedAt: animal.publishedAt ? new Date(animal.publishedAt as string).toISOString() : '',
    })
  }, [animal, form])

  function autoSlug(name: string) {
    if (!isEditing) form.setValue('slug', name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
  }

  function handleSubmit(data: Record<string, unknown>) {
    const payload: Record<string, unknown> = {}
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'sizeId' || key === 'ageRangeId' || key === 'breed' || key === 'birthDate' || key === 'coverUrl' || key === 'description' || key === 'content') {
        payload[key] = (value as string) || null
      } else if (key === 'publishedAt') {
        payload[key] = (value as string) || null
      } else {
        payload[key] = value
      }
    })
    if (isEditing && animal) {
      update.mutate({ slug: animal.slug as string, data: payload }, { onSuccess })
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
          <Label htmlFor="speciesId">Espécie</Label>
          <Select onValueChange={(v) => form.setValue('speciesId', v)} value={form.watch('speciesId')}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              {species?.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="gender">Sexo</Label>
          <Select onValueChange={(v) => form.setValue('gender', v as 'MALE' | 'FEMALE')} value={form.watch('gender')}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={AnimalGender.MALE}>Macho</SelectItem>
              <SelectItem value={AnimalGender.FEMALE}>Fêmea</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="breed">Raça (opcional)</Label>
        <Input id="breed" {...form.register('breed')} placeholder="SRD" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="sizeId">Porte</Label>
          <Select onValueChange={(v) => form.setValue('sizeId', v)} value={form.watch('sizeId') ?? ''}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              {sizes?.map((s) => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="ageRangeId">Faixa etária</Label>
          <Select onValueChange={(v) => form.setValue('ageRangeId', v)} value={form.watch('ageRangeId') ?? ''}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              {ageRanges?.map((r) => <SelectItem key={r.id} value={r.id}>{r.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="birthDate">Data de nascimento</Label>
          <Input id="birthDate" type="date" {...form.register('birthDate')} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="status">Status</Label>
          <Select onValueChange={(v) => form.setValue('status', v as 'AVAILABLE' | 'ADOPTED' | 'FOSTERED')} value={form.watch('status')}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={AnimalStatus.AVAILABLE}>Disponível</SelectItem>
              <SelectItem value={AnimalStatus.ADOPTED}>Adotado</SelectItem>
              <SelectItem value={AnimalStatus.FOSTERED}>Lar Temporário</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="coverUrl">Foto principal (URL)</Label>
        <Input id="coverUrl" {...form.register('coverUrl')} placeholder="https://..." />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Descrição (card)</Label>
        <Textarea id="description" {...form.register('description')} placeholder="Resumo para o card" rows={2} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="content">História completa</Label>
        <Textarea id="content" {...form.register('content')} placeholder="História completa do animal" rows={4} />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Switch id="featured" checked={form.watch('featured')} onCheckedChange={(v) => form.setValue('featured', v)} />
          <Label htmlFor="featured">Destaque</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="published" checked={!!form.watch('publishedAt')} onCheckedChange={(v) => form.setValue('publishedAt', v ? new Date().toISOString() : '')} />
          <Label htmlFor="published">Publicado</Label>
        </div>
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
