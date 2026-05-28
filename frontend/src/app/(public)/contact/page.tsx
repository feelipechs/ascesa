import type { Metadata } from 'next'
import { ContactHero, ContactMap, ContactContent } from './_sections'
import { PageSection } from '@/components/page-section'

export const metadata: Metadata = {
  title: 'Contato — Ascesa',
  description:
    'Entre em contato com a Ascesa. Envie sua mensagem ou encontre nossos canais de atendimento.',
}

export default function ContactPage() {
  return (
    <main className="flex flex-col pt-17.5">
      <ContactHero />
      <PageSection>
        <ContactContent />
      </PageSection>
      <ContactMap />
    </main>
  )
}
