import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden bg-foreground py-20 md:py-28">
        <div className="container mx-auto px-4">
          <Skeleton className="mb-8 h-4 w-32" />
          <Skeleton className="mb-4 h-12 w-96" />
          <Skeleton className="h-6 w-72" />
        </div>
      </section>
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <Skeleton className="mb-10 h-8 w-48" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
      <section className="border-t border-border/50 bg-card py-16 md:py-20">
        <div className="container mx-auto px-4">
          <Skeleton className="mb-10 h-8 w-48" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
