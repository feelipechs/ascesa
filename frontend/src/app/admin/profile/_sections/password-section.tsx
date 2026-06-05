'use client'

import { Controller, type UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { UpdateMeInput } from '@/schemas/me.schema'

type PasswordSectionProps = {
  form: UseFormReturn<UpdateMeInput>
  isEditing: boolean
  isSaving: boolean
}

export function PasswordSection({ form, isEditing, isSaving }: PasswordSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alterar Senha</CardTitle>
        <CardDescription>Digite sua senha atual e a nova senha desejada.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Controller
          control={form.control}
          name="password"
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Nova senha</Label>
              <Input
                id="password"
                type="password"
                {...field}
                value={field.value ?? ''}
                placeholder="Mínimo de 6 caracteres"
              />
            </div>
          )}
        />
        {isEditing && (
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
