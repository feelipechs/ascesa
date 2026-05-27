import type { Metadata } from 'next'
import { DonationsContent } from './_sections/donations-content'
import { DonationsHero } from './_sections'

export const metadata: Metadata = {
  title: 'Doações — Ascesa',
  description:
    'Contribua com a Ascesa. Sua doação ajuda a manter nossos projetos de resgate, castração solidária e adoção responsável.',
}

export default function DonationsPage() {
  return (
    <main className="flex flex-col pt-17.5">
      <DonationsHero />
      <DonationsContent />
    </main>
  )
}
