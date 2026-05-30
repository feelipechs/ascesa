import { Skeleton } from '@/components/ui/skeleton'

export default function DonationsLoading() {
  return (
    <main className="flex flex-col pt-17.5">
      <section className="border-b border-border py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <Skeleton className="mx-auto mb-3 h-5 w-36 rounded-full" />
          <Skeleton className="mx-auto mb-4 h-12 w-56" />
          <Skeleton className="mx-auto h-5 w-full max-w-lg" />
        </div>
      </section>
      <section className="py-12 sm:py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl border bg-card">
                <div className="p-6 space-y-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
