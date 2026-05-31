import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Target, Eye, Heart } from 'lucide-react'
import { PageSection } from '@/components/page-section'
import { SectionHeading } from '@/components/section-heading'

type AboutMvvProps = {
  mission?: string | null
  vision?: string | null
  values?: string | null
}

const items = [
  {
    type: 'mission' as const,
    icon: Target,
    title: 'Missão',
    color: 'text-chart-1',
    bgColor: 'bg-chart-1/10',
  },
  {
    type: 'vision' as const,
    icon: Eye,
    title: 'Visão',
    color: 'text-chart-2',
    bgColor: 'bg-chart-2/10',
  },
  {
    type: 'values' as const,
    icon: Heart,
    title: 'Valores',
    color: 'text-chart-3',
    bgColor: 'bg-chart-3/10',
  },
]

export function AboutMvv({ mission, vision, values }: AboutMvvProps) {
  const valuesList = values ? values.split(',').map((v) => v.trim()) : []

  const descriptions: Record<'mission' | 'vision', string> = {
    mission: mission ?? '',
    vision: vision ?? '',
  }

  return (
    <PageSection borderTop className="animate-in fade-in-0 duration-500">
      <div className="max-w-3xl mx-auto text-center">
        <span className="text-sm font-medium text-primary uppercase tracking-wider">
          Nossos Pilares
        </span>
        <SectionHeading
          title="Missão, Visão e Valores"
          description="Conheça os princípios que guiam nossas ações e nosso compromisso com a comunidade."
        />
        <div className="h-1 w-16 bg-primary mx-auto rounded-full" />
      </div>
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {items.map((card) => (
        <Card
          key={card.type}
          className="flex h-full flex-col border-none shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
            <CardHeader className="text-center pb-2">
              <div
                className={`mx-auto w-14 h-14 ${card.bgColor} rounded-full flex items-center justify-center mb-4`}
              >
                <card.icon className={`w-7 h-7 ${card.color}`} />
              </div>
              <CardTitle className="text-xl">{card.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center text-center">
              {card.type === 'values' ? (
                <div className="flex flex-wrap justify-center gap-2">
                  {valuesList.map((v, idx) => (
                    <span
                      key={idx}
                      className="h-auto px-4 py-2 bg-primary/10 text-primary text-sm rounded-full"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground leading-relaxed">{descriptions[card.type]}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </PageSection>
  )
}
