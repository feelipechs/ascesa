'use client'
import { useStats } from '@/hooks/stats/queries'
import { NumberTicker } from '@/components/ui/number-ticker'

export function StatsSection() {
  const { data: stats = [] } = useStats()

  if (stats.length === 0) return null

  return (
    <section className="w-full py-16 md:py-20 lg:py-24 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat) => (
            <div key={stat.id} className="flex flex-col items-center text-center gap-2">
              <span className="text-4xl md:text-5xl font-bold text-primary">
                <NumberTicker value={Number(stat.value)} />
              </span>
              <span className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
