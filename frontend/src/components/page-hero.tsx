interface PageHeroProps {
  badge: string
  heading: string
  description: string
}

export function PageHero({ badge, heading, description }: PageHeroProps) {
  return (
    <section className="border-b border-border py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <p className="text-primary text-sm font-medium uppercase tracking-wider mb-3">{badge}</p>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl text-balance">{heading}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground text-pretty">
          {description}
        </p>
      </div>
    </section>
  )
}
