import type { Metadata } from 'next'
import { auth } from '@/auth'
import { TransparencyContent, TransparencyHero } from './_sections'

export const metadata: Metadata = {
  title: 'Transparência — Ascesa',
  description:
    'Acesse os documentos institucionais, relatórios financeiros e prestações de contas da Ascesa. Nosso compromisso com a transparência.',
}

export default async function TransparenciaPage() {
  const session = await auth()
  const isAuthenticated = !!session
  return (
    <main className="flex flex-col pt-17.5">
      <TransparencyHero />
      <TransparencyContent isAuthenticated={isAuthenticated} />
    </main>
  )
}
