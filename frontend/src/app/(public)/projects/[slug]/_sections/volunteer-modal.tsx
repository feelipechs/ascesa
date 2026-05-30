'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { publicRegistrationSchema, type PublicRegistrationInput } from '@/schemas/registration.schema'
import { useRegistrationMutations } from '@/hooks/registrations/queries'
import { Loader2 } from 'lucide-react'

type VolunteerModalProps = {
  projectId: string
  projectTitle: string
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function VolunteerModal({ projectId, projectTitle, children, open, onOpenChange }: VolunteerModalProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const { publicRegister, isPending } = useRegistrationMutations()

  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen
  const setIsOpen = isControlled ? onOpenChange! : setInternalOpen

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PublicRegistrationInput>({
    resolver: zodResolver(publicRegistrationSchema),
    defaultValues: { projectId },
  })

  function onSubmit(data: PublicRegistrationInput) {
    publicRegister.mutate(data, {
      onSuccess: () => {
        reset()
        setIsOpen(false)
      },
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Inscrever-se como voluntário</DialogTitle>
          <DialogDescription>
            {projectTitle}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register('projectId')} />

          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input id="name" placeholder="Seu nome completo" {...register('name')} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" placeholder="seu@email.com" {...register('email')} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input id="phone" placeholder="(11) 99999-9999" {...register('phone')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mensagem</Label>
            <Textarea id="message" placeholder="Conte um pouco sobre você..." {...register('message')} />
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? 'Enviando...' : 'Quero ser voluntário'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
