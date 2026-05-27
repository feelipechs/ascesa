import type { Metadata } from 'next'
import { auth } from '@/auth'
import { AreasHero, AreasContent } from './_sections'

export const metadata: Metadata = {
  title: 'Áreas de Atuação — Ascesa',
  description:
    'Conheça as áreas de atuação da Ascesa: resgate e acolhimento, castração solidária, adoção responsável, apoio veterinário e mais.',
}

export default async function AreasPage() {
  const session = await auth()
  const isAuthenticated = !!session

  return (
    <main className="flex flex-col pt-17.5">
      <AreasHero />
      <AreasContent isAuthenticated={isAuthenticated} />
    </main>
  )
}
