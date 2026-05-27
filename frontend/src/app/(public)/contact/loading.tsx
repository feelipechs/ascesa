import { Skeleton } from '@/components/ui/skeleton'

export default function ContatoLoading() {
  return (
    <main className="flex flex-col pt-17.5">
      <section className="border-b border-border py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <Skeleton className="mx-auto mb-3 h-5 w-32 rounded-full" />
          <Skeleton className="mx-auto mb-4 h-12 w-80" />
          <Skeleton className="mx-auto h-5 w-full max-w-lg" />
        </div>
      </section>
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-6 w-48" />
            <div className="space-y-6">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
          <div className="rounded-xl border bg-card">
            <div className="p-6 space-y-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
