'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    // Simula envio do formulário
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <svg
            className="h-8 w-8 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-semibold text-foreground">Mensagem enviada!</h3>
        <p className="text-muted-foreground">Obrigado pelo contato. Responderemos em breve.</p>
        <Button variant="outline" className="mt-6" onClick={() => setIsSubmitted(false)}>
          Enviar nova mensagem
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" name="name" placeholder="Seu nome completo" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input id="phone" name="phone" type="tel" placeholder="(00) 00000-0000" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Assunto</Label>
        <Input id="subject" name="subject" placeholder="Assunto da mensagem" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Mensagem</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Digite sua mensagem aqui..."
          rows={5}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Spinner className="mr-2" />
            Enviando...
          </>
        ) : (
          'Enviar mensagem'
        )}
      </Button>
    </form>
  )
}
