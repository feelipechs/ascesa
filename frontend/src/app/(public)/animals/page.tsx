import type { Metadata } from 'next'
import { auth } from '@/auth'
import { headers } from 'next/headers'
import { AnimalsContent, AnimalsHero } from './_sections'

export const metadata: Metadata = {
  title: 'Animais — Ascesa',
  description:
    'Conheça os animais disponíveis para adoção na Ascesa. Cães e gatos resgatados que esperam por um lar amoroso.',
}

export default async function AnimalsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const isAuthenticated = !!session

  return (
    <main className="flex flex-col pt-17.5">
      <AnimalsHero />
      <AnimalsContent isAuthenticated={isAuthenticated} />
    </main>
  )
}
