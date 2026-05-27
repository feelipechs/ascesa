import type { Metadata } from 'next'
import { auth } from '@/auth'
import { AboutHero, AboutContent } from './_sections'

export const metadata: Metadata = {
  title: 'Sobre Nós — Ascesa',
  description:
    'Conheça a história da Ascesa, nossa missão, visão e valores. Trabalhamos pelo resgate, cuidado e bem-estar dos animais.',
}

export default async function AboutPage() {
  const session = await auth()
  const isAuthenticated = !!session

  return (
    <main className="flex flex-col pt-17.5">
      <AboutHero />
      <AboutContent isAuthenticated={isAuthenticated} />
    </main>
  )
}
