import { Skeleton } from '@/components/ui/skeleton'

export default function AnimalLoading() {
  return (
    <main className="min-h-screen bg-background pt-17.5">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Skeleton className="mb-6 h-9 w-36" />
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-[4/3] rounded-xl" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-4 w-64" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-20 rounded-lg" />
              <Skeleton className="h-20 rounded-lg" />
            </div>
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    </main>
  )
}
