import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="overflow-x-hidden">
      <section className="relative min-h-[100dvh] w-full overflow-hidden bg-foreground">
        <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6">
          <Skeleton className="mb-6 h-6 w-40 rounded-full" />
          <Skeleton className="mb-6 h-16 w-3/4 max-w-4xl" />
          <Skeleton className="mb-12 h-6 w-96" />
          <div className="flex gap-12">
            <Skeleton className="h-16 w-28" />
            <Skeleton className="h-16 w-28" />
            <Skeleton className="h-16 w-28" />
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
