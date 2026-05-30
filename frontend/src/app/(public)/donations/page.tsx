import type { Metadata } from 'next'
import { auth } from '@/auth'
import { DonationsContent, DonationsHero } from './_sections'

export const metadata: Metadata = {
  title: 'Doações — Ascesa',
  description:
    'Contribua com a Ascesa. Sua doação ajuda a manter nossos projetos de resgate, castração solidária e adoção responsável.',
}

export default async function DonationsPage() {
  const session = await auth()
  const isAuthenticated = !!session

  return (
    <main className="flex flex-col pt-17.5">
      <DonationsHero />
      <DonationsContent isAuthenticated={isAuthenticated} />
    </main>
  )
}
