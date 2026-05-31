import type { Metadata } from 'next'
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { auth } from '@/auth'
import { StatService } from '@/services/stat.service'
import { HomeContent } from './_sections'

export const metadata: Metadata = {
  title: 'Ascesa — Amor e Cuidado por Cada Animal',
  description:
    'ONG de resgate, cuidado e apoio a animais. Conectamos animais abandonados a famílias amorosas com transparência e carinho.',
}

export default async function Home() {
  const session = await auth()
  const isAuthenticated = !!session

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60,
      },
    },
  })
  await queryClient.prefetchQuery({
    queryKey: ['stats', 'list'],
    queryFn: () => StatService.findAll(),
  })

  return (
    <main className="flex flex-col">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HomeContent isAuthenticated={isAuthenticated} />
      </HydrationBoundary>
    </main>
  )
}
