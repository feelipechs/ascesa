import { Skeleton } from '@/components/ui/skeleton'

export default function SobreLoading() {
  return (
    <main className="flex flex-col pt-17.5">
      <section className="border-b border-border py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <Skeleton className="mx-auto mb-3 h-5 w-40 rounded-full" />
          <Skeleton className="mx-auto mb-4 h-12 w-56" />
          <Skeleton className="mx-auto h-5 w-full max-w-lg" />
        </div>
      </section>
      <div className="space-y-16 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <Skeleton className="mx-auto mb-12 h-8 w-48" />
          <Skeleton className="mb-4 h-4 w-full" />
          <Skeleton className="mb-4 h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
        <div className="mx-auto max-w-5xl px-4">
          <Skeleton className="mx-auto mb-12 h-8 w-64" />
          <div className="grid gap-6 md:grid-cols-3">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4">
          <Skeleton className="mx-auto mb-12 h-8 w-48" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
