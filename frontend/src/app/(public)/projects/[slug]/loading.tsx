import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="overflow-x-hidden">
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden bg-muted" />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <Skeleton className="mb-8 h-4 w-32" />
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-8 w-48" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
            <Skeleton className="h-8 w-32" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="aspect-[3/2] rounded-lg" />
              <Skeleton className="aspect-[3/2] rounded-lg" />
            </div>
          </div>
          <aside className="space-y-6">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </aside>
        </div>
      </div>
    </div>
  )
}
