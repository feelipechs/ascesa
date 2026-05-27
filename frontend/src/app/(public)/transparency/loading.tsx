import { Skeleton } from '@/components/ui/skeleton'

export default function TransparenciaLoading() {
  return (
    <main className="flex flex-col pt-17.5">
      <section className="border-b border-border py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="mx-auto mb-3 h-5 w-40 rounded-full" />
          <Skeleton className="mx-auto mb-4 h-12 w-64" />
          <Skeleton className="mx-auto h-5 w-full max-w-xl" />
        </div>
      </section>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-8 flex gap-4">
          <Skeleton className="h-10 w-48 rounded-lg" />
          <Skeleton className="h-10 w-40 rounded-lg" />
        </div>
        <div className="space-y-16">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <Skeleton className="mb-6 h-8 w-64" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-40 rounded-xl" />
                <Skeleton className="h-40 rounded-xl" />
                <Skeleton className="h-40 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
