'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createTestimonialSchema, updateTestimonialSchema } from '@/schemas/testimonial.schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useTestimonialMutations, testimonialQueryOptions } from '@/hooks/testimonials/queries'
import { useQuery } from '@tanstack/react-query'


type TestimonialFormProps = {
  testimonialId?: string
  onSuccess: () => void
  onCancel: () => void
}

export function TestimonialForm({ testimonialId, onSuccess, onCancel }: TestimonialFormProps) {
  const isEditing = !!testimonialId
  const { data: testimonialData } = useQuery(testimonialQueryOptions(testimonialId))
  const { create, update, isPending } = useTestimonialMutations()

  const form = useForm({
    resolver: zodResolver(isEditing ? updateTestimonialSchema : createTestimonialSchema),
    defaultValues: {
      name: '',
      role: '',
      message: '',
    },
  })

  useEffect(() => {
    if (!testimonialData) return
    form.reset({
      name: testimonialData.name ?? '',
      role: testimonialData.role ?? '',
      message: testimonialData.message ?? '',
    })
  }, [testimonialData, form])

  function handleSubmit(data: Record<string, unknown>) {
    const payload = {
      ...data,
      role: (data.role as string) || undefined,
    }
    if (isEditing && testimonialId) {
      update.mutate({ id: testimonialId, data: payload }, { onSuccess })
    } else {
      create.mutate(payload, { onSuccess })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" {...form.register('name')} required placeholder="Nome do depoente" />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive">{form.formState.errors.name.message as string}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="role">Cargo / Vínculo</Label>
        <Input id="role" {...form.register('role')} placeholder="Ex: Adotante, Voluntário, Doador" />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="message">Depoimento</Label>
        <Textarea id="message" {...form.register('message')} required rows={4} placeholder="Mensagem do depoente..." />
        {form.formState.errors.message && (
          <p className="text-sm text-destructive">{form.formState.errors.message.message as string}</p>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancelar</Button>
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Adicionar depoimento'}
        </Button>
      </div>
    </form>
  )
}
