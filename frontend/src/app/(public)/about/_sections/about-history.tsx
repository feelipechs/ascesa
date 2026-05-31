import { Card, CardContent } from '@/components/ui/card'
import { PageSection } from '@/components/page-section'
import { SectionHeading } from '@/components/section-heading'
import { EmptyState } from '@/components/empty-state'

type AboutHistoryProps = {
  about?: string | null
}

export function AboutHistory({ about }: AboutHistoryProps) {
  return (
    <PageSection>
      <div className="max-w-3xl mx-auto text-center">
        <span className="text-sm font-medium text-primary uppercase tracking-wider">
          Quem Somos
        </span>
        <SectionHeading title="Nossa História" />
        <div className="h-1 w-16 bg-primary mx-auto rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="border-none shadow-lg">
          <CardContent className="p-8 md:p-12">
            <div className="space-y-6 text-muted-foreground leading-relaxed animate-in fade-in-0 duration-500">
              {about ? (
                about.split('\n\n').map((paragraph, i) => <p key={i}>{paragraph}</p>)
              ) : (
                <EmptyState title="Nenhuma informação cadastrada." />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageSection>
  )
}
