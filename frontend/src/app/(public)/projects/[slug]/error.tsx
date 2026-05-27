'use client'

import { Button } from '@/components/ui/button'

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-semibold">Algo deu errado</h2>
      <p className="text-muted-foreground">Não foi possível carregar os dados deste projeto.</p>
      <Button onClick={() => reset()} variant="outline">
        Tentar novamente
      </Button>
    </main>
  )
}
