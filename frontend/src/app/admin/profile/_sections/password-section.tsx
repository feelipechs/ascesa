'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { changePassword } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/utils'

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Senha atual obrigatória'),
    newPassword: z.string().min(6, 'Nova senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirmação obrigatória'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

type ChangePasswordInput = z.infer<typeof changePasswordSchema>

export function PasswordSection() {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  function handleCancel() {
    setIsEditing(false)
    form.reset()
  }

  async function onSubmit(data: ChangePasswordInput) {
    setIsSaving(true)
    try {
      const result = await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })

      if (result.error) {
        toast.error('Falha ao alterar senha', {
          description: result.error.message ?? 'Senha atual incorreta.',
        })
        return
      }

      toast.success('Senha atualizada!')
      setIsEditing(false)
      form.reset()
    } catch (error) {
      toast.error('Falha ao alterar senha', {
        description: getErrorMessage(error),
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alterar Senha</CardTitle>
        <CardDescription>Digite sua senha atual e a nova senha desejada.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isEditing ? (
          <Button type="button" onClick={() => setIsEditing(true)}>
            Alterar senha
          </Button>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="currentPassword">Senha atual</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="Digite sua senha atual"
                {...form.register('currentPassword')}
              />
              {form.formState.errors.currentPassword && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="newPassword">Nova senha</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Mínimo de 6 caracteres"
                {...form.register('newPassword')}
              />
              {form.formState.errors.newPassword && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repita a nova senha"
                {...form.register('confirmPassword')}
              />
              {form.formState.errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Salvando...' : 'Salvar alterações'}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
