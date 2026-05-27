'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { toast } from 'sonner'
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
import { RegistrationsApi } from '@/lib/api/registrations'
import { getErrorMessage } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

const formSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  message: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

type VolunteerModalProps = {
  projectId: string
  projectTitle: string
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function VolunteerModal({ projectId, projectTitle, children, open, onOpenChange }: VolunteerModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [internalOpen, setInternalOpen] = useState(false)

  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen
  const setIsOpen = isControlled ? onOpenChange! : setInternalOpen

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(data: FormData) {
    setIsSubmitting(true)
    try {
      await RegistrationsApi.publicRegister({
        ...data,
        projectId,
      })
      toast.success('Inscrição realizada com sucesso!')
      reset()
      setIsOpen(false)
    } catch (error) {
      toast.error('Falha ao realizar inscrição', {
        description: getErrorMessage(error),
      })
    } finally {
      setIsSubmitting(false)
    }
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

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Enviando...' : 'Quero ser voluntário'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
