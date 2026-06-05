'use client'

import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createUserSchema, updateUserSchema } from '@/schemas/user.schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUserMutations, userQueryOptions } from '@/hooks/users/queries'
import { useQuery } from '@tanstack/react-query'
import { useSession } from '@/lib/auth-client'

type UserFormProps = {
  userId?: string
  onSuccess: () => void
  onCancel: () => void
}

export function UserForm({ userId, onSuccess, onCancel }: UserFormProps) {
  const isEditing = !!userId
  const { data: session } = useSession()
  const { data: userData } = useQuery(userQueryOptions(userId))
  const { create, update, isPending } = useUserMutations()
  const isAdmin = session?.user?.role === 'ADMIN'

  const form = useForm({
    resolver: zodResolver(isEditing ? updateUserSchema : createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'STAFF' as const,
    },
  })

  useEffect(() => {
    if (!userData) return
    form.reset({
      name: userData.name ?? '',
      email: userData.email ?? '',
      password: '',
      role: userData.role,
    })
  }, [userData, form])

  function handleSubmit(data: Record<string, unknown>) {
    const password = (data.password as string) || ''

    if (isEditing && userId) {
      const payload: Record<string, unknown> = { name: data.name, email: data.email }
      if (data.role && isAdmin) payload.role = data.role
      if (password) payload.password = password
      update.mutate({ id: userId, data: payload }, { onSuccess })
    } else {
      create.mutate({ ...data, password, role: data.role ?? 'STAFF' }, { onSuccess })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" {...form.register('name')} placeholder="Nome do usuário" />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...form.register('email')} required placeholder="email@exemplo.com" />
        {form.formState.errors.email && (
          <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">{isEditing ? 'Nova senha (deixe vazio para manter)' : 'Senha'}</Label>
        <Input id="password" type="password" {...form.register('password')} required={!isEditing} placeholder="Mínimo 6 caracteres" />
        {form.formState.errors.password && (
          <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
        )}
      </div>

      {isAdmin && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="role">Perfil</Label>
          <Controller
            control={form.control}
            name="role"
            render={({ field }) => (
              <Select value={field.value ?? 'STAFF'} onValueChange={field.onChange}>
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STAFF">STAFF</SelectItem>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancelar</Button>
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Adicionar usuário'}
        </Button>
      </div>
    </form>
  )
}
