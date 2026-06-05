'use client'

import { Controller, type UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { UpdateMeInput } from '@/schemas/me.schema'

type AccountInfoSectionProps = {
  form: UseFormReturn<UpdateMeInput>
  isEditing: boolean
  isSaving: boolean
  onEdit: () => void
  onCancel: () => void
}

export function AccountInfoSection({ form, isEditing, isSaving, onEdit, onCancel }: AccountInfoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações da Conta</CardTitle>
        <CardDescription>Seu nome e email associados à sua conta.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isEditing ? (
          <>
            <div className="flex flex-col gap-2">
              <Label>Nome</Label>
              <p>{form.watch('name')}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Email</Label>
              <p>{form.watch('email')}</p>
            </div>
            <Button type="button" onClick={onEdit}>
              Editar
            </Button>
          </>
        ) : (
          <>
            <Controller
              control={form.control}
              name="name"
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" {...field} value={field.value ?? ''} />
                </div>
              )}
            />
            <Controller
              control={form.control}
              name="email"
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...field} value={field.value ?? ''} />
                </div>
              )}
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Salvando...' : 'Salvar'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
