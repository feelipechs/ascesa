'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from '@/lib/auth-client'
import { Separator } from '@/components/ui/separator'
import { useMeMutations } from '@/hooks/me/queries'
import { updateMeSchema, type UpdateMeInput } from '@/schemas/me.schema'
import { AccountInfoSection } from './_sections/account-info-section'
import { PasswordSection } from './_sections/password-section'

export default function ProfilePage() {
  const { data: session } = useSession()
  const { update, isPending } = useMeMutations()
  const [isEditing, setIsEditing] = useState(false)

  const form = useForm<UpdateMeInput>({
    resolver: zodResolver(updateMeSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  })

  if (session?.user && !form.formState.isDirty && form.getValues('name') === '') {
    form.reset({
      name: session.user.name ?? '',
      email: session.user.email ?? '',
    })
  }

  function onSubmit(data: UpdateMeInput) {
    const payload: UpdateMeInput = {}
    if (data.name !== session?.user?.name) payload.name = data.name
    if (data.email !== session?.user?.email) payload.email = data.email
    if (Object.keys(payload).length === 0) return

    update.mutate(payload, {
      onSuccess: () => {
        setIsEditing(false)
      },
    })
  }

  return (
    <div className="px-4 lg:px-6 space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold">Meu Perfil</h1>
        <p className="text-muted-foreground">Gerencie suas informações pessoais e senha.</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <AccountInfoSection
          form={form}
          isEditing={isEditing}
          isSaving={isPending}
          onEdit={() => setIsEditing(true)}
          onCancel={() => {
            setIsEditing(false)
            form.reset({
              name: session?.user?.name ?? '',
              email: session?.user?.email ?? '',
            })
          }}
        />
      </form>

      <Separator />

      <PasswordSection />
    </div>
  )
}
