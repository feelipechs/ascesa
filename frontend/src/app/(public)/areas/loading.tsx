import { Skeleton } from '@/components/ui/skeleton'

export default function AreasLoading() {
  return (
    <main className="flex flex-col pt-17.5">
      <section className="border-b border-border py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <Skeleton className="mx-auto mb-3 h-5 w-40 rounded-full" />
          <Skeleton className="mx-auto mb-4 h-12 w-96" />
          <Skeleton className="mx-auto h-5 w-full max-w-xl" />
        </div>
      </section>
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
