import type { Metadata } from 'next'
import { auth } from '@/auth'
import { HomeContent } from './_sections'

export const metadata: Metadata = {
  title: 'Ascesa — Amor e Cuidado por Cada Animal',
  description:
    'ONG de resgate, cuidado e apoio a animais. Conectamos animais abandonados a famílias amorosas com transparência e carinho.',
}

export default async function Home() {
  const session = await auth()
  const isAuthenticated = !!session

  return <HomeContent isAuthenticated={isAuthenticated} />
}
