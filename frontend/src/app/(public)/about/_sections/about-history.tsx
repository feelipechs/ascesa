import { Card, CardContent } from '@/components/ui/card'
import { PageSection } from '@/components/page-section'
import { EmptyState } from '@/components/empty-state'

type AboutHistoryProps = {
  about?: string | null
}

export function AboutHistory({ about }: AboutHistoryProps) {
  return (
    <PageSection>
      <div className="max-w-3xl mx-auto text-center mb-12">
        <span className="text-sm font-medium text-primary uppercase tracking-wider">
          Quem Somos
        </span>
        <h2 className="mt-2 text-3xl md:text-4xl font-bold text-foreground">Nossa História</h2>
        <div className="mt-4 h-1 w-16 bg-primary mx-auto rounded-full" />
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
