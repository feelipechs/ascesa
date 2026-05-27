import type { Metadata } from 'next'
import { ContactHero, ContactMap, ContactContent } from './_sections'

export const metadata: Metadata = {
  title: 'Contato — Ascesa',
  description:
    'Entre em contato com a Ascesa. Envie sua mensagem ou encontre nossos canais de atendimento.',
}

export default function ContactPage() {
  return (
    <main className="flex flex-col pt-17.5">
      <ContactHero />
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <ContactContent />
      </section>
      <ContactMap />
    </main>
  )
}
