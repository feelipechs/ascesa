import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <main className="flex flex-col">
      <section className="relative min-h-dvh bg-background flex items-center px-6 md:px-12 lg:px-20">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <div className="space-y-7">
            <Skeleton className="h-16 w-3/4" />
            <Skeleton className="h-6 w-2/3" />
            <div className="flex gap-4">
              <Skeleton className="h-14 w-36 rounded-xl" />
              <Skeleton className="h-14 w-40 rounded-xl" />
            </div>
          </div>
          <div className="hidden lg:flex items-center justify-center">
            <Skeleton className="aspect-[3/2] w-full rounded-2xl" />
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
