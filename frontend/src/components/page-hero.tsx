interface PageHeroProps {
  badge: string
  heading: string
  description: string
  width?: 'default' | 'narrow'
}

import { cn } from '@/lib/utils'

export function PageHero({ badge, heading, description, width = 'default' }: PageHeroProps) {
  return (
    <section className="border-b border-border py-16 md:py-24">
      <div className={cn('mx-auto px-4 sm:px-6 lg:px-8 text-center', width === 'narrow' ? 'max-w-4xl' : 'max-w-6xl')}>
        <p className="text-primary text-sm font-medium uppercase tracking-wider mb-3">{badge}</p>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl text-balance">{heading}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground text-pretty">
          {description}
        </p>
      </div>
    </section>
  )
}
