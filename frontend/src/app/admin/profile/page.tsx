'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

export default function ProfilePage() {
  const { data: session, update } = useSession()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (!session?.user) return
    setName(session.user.name ?? '')
    setEmail(session.user.email ?? '')
  }, [session])
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)
    try {
      const body: Record<string, string> = {}
      if (name !== session?.user?.name) body.name = name
      if (email !== session?.user?.email) body.email = email
      if (currentPassword && newPassword) {
        body.currentPassword = currentPassword
        body.password = newPassword
      }

      const res = await fetch('/api/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error?.message || 'Erro ao salvar')
      }

      await update()
      setCurrentPassword('')
      setNewPassword('')
      setIsEditing(false)
      toast.success('Perfil atualizado!')
    } catch (err) {
      toast.error('Falha ao atualizar perfil')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="px-4 lg:px-6 space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold">Meu Perfil</h1>
        <p className="text-muted-foreground">Gerencie suas informações pessoais e senha.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
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
                  <p>{name}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Email</Label>
                  <p>{email}</p>
                </div>
                <Button type="button" onClick={() => setIsEditing(true)}>
                  Editar
                </Button>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? 'Salvando...' : 'Salvar'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Alterar Senha</CardTitle>
            <CardDescription>Digite sua senha atual e a nova senha desejada.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="currentPassword">Senha atual</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="newPassword">Nova senha</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
              />
            </div>
            {isEditing && (
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Salvando...' : 'Salvar alterações'}
              </Button>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
