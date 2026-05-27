'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

type PageErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export function PageError({ error, reset }: PageErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center px-4">
      <h2 className="text-xl font-semibold">Algo deu errado</h2>
      <p className="text-muted-foreground max-w-sm">
        Não foi possível carregar esta página. Tente novamente.
      </p>
      <Button onClick={reset} variant="outline">
        Tentar novamente
      </Button>
    </div>
  )
}
