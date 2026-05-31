'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { AdminActions } from '@/components/admin/admin-actions'
import { AdminSheet } from '@/components/admin/admin-sheet'
import { StatForm } from '@/components/admin/forms/stat-form'
import { useStats, useStatMutations, statKeys } from '@/hooks/stats/queries'
import { DeleteDialog } from '@/components/delete-dialog'
import { EmptyState } from '@/components/empty-state'
import { SortableList, SortableItem } from '@/components/sortable-list'
import { useReorder } from '@/hooks/use-reorder'
import { StatsApi } from '@/lib/api/stats'
import { NumberTicker } from '@/components/ui/number-ticker'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Plus, GripVertical } from 'lucide-react'
import { PageSection } from '@/components/page-section'
import { SectionHeading } from '@/components/section-heading'

type StatsSectionProps = {
  isAuthenticated?: boolean
}

export function StatsSection({ isAuthenticated }: StatsSectionProps) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingStat, setEditingStat] = useState<null | { id: string }>(null)
  const [deletingStat, setDeletingStat] = useState<null | { id: string }>(null)
  const { data: stats = [], isLoading } = useStats()
  const { remove, isPending } = useStatMutations()
  const queryClient = useQueryClient()

  const { optimisticItems, reorder, setOptimisticItems } = useReorder(stats, { field: 'order' })

  function handleNew() {
    setEditingStat(null)
    setSheetOpen(true)
  }

  function handleEdit(stat: { id: string }) {
    setEditingStat(stat)
    setSheetOpen(true)
  }

  function handleSheetClose() {
    setSheetOpen(false)
    setEditingStat(null)
  }

  async function handleReorder(activeIndex: number, overIndex: number) {
    const reordered = reorder(activeIndex, overIndex)
    if (!reordered) return

    const items = reordered.map((item, i) => ({ id: item.id, order: i }))
    try {
      await StatsApi.reorder(items)
      queryClient.invalidateQueries({ queryKey: statKeys.all })
    } catch {
      toast.error('Falha ao reordenar')
      setOptimisticItems(stats)
    }
  }

  if (isLoading)
    return (
      <PageSection sectionClassName="bg-muted/30" padding="compact">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
      </PageSection>
    )

  if (!isLoading && stats.length === 0 && !isAuthenticated) return null

  const action = isAuthenticated ? { label: 'Adicionar', onClick: handleNew } : undefined

  return (
    <>
      <PageSection sectionClassName="bg-muted/30" padding="compact">
        <SectionHeading
          title="Nossos Números"
          description="O impacto do nosso trabalho em números."
          action={action}
        />

        {optimisticItems.length > 0 ? (
          isAuthenticated ? (
            <SortableList items={optimisticItems} onReorder={handleReorder}>
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
                {optimisticItems.map((stat) => (
                  <SortableItem key={stat.id} id={stat.id}>
                    {({ attributes, listeners, isDragging }) => (
                      <div
                        className={`relative flex flex-col items-center text-center gap-1 py-4 ${isDragging ? 'opacity-50' : ''}`}
                      >
                        <div className="absolute top-0 right-0 z-10 flex items-center gap-1">
                          <button
                            {...attributes}
                            {...listeners}
                            className="cursor-grab active:cursor-grabbing touch-none flex items-center justify-center h-7 w-7 rounded-md bg-background/95 backdrop-blur shadow-sm border hover:bg-muted"
                          >
                            <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
                          </button>
                          <AdminActions
                            onEdit={() => handleEdit(stat)}
                            onDelete={() => setDeletingStat({ id: stat.id })}
                          />
                        </div>
                        <span className="text-3xl md:text-4xl font-bold text-primary">
                          <NumberTicker
                            value={Number(
                              String(stat.value).replace(/[^\d.,]/g, '').replace(',', '.')
                            )}
                          />
                        </span>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                          {stat.label}
                        </span>
                      </div>
                    )}
                  </SortableItem>
                ))}
              </div>
            </SortableList>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
              {optimisticItems.map((stat) => (
                <div key={stat.id} className="flex flex-col items-center text-center gap-1 py-4">
                  <span className="text-3xl md:text-4xl font-bold text-primary">
                    <NumberTicker
                      value={Number(
                        String(stat.value).replace(/[^\d.,]/g, '').replace(',', '.')
                      )}
                    />
                  </span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          )
        ) : (
          <EmptyState title="Nenhuma métrica cadastrada." />
        )}
      </PageSection>

      {isAuthenticated && (
        <AdminSheet
          open={sheetOpen}
          onClose={handleSheetClose}
          title={editingStat ? 'Editar métrica' : 'Nova métrica'}
        >
          <StatForm
            statId={editingStat?.id}
            onSuccess={handleSheetClose}
            onCancel={handleSheetClose}
          />
        </AdminSheet>
      )}

      {isAuthenticated && (
        <DeleteDialog
          open={!!deletingStat}
          onClose={() => setDeletingStat(null)}
          onConfirm={() => {
            if (deletingStat)
              remove.mutate(deletingStat.id, { onSuccess: () => setDeletingStat(null) })
          }}
          isPending={isPending}
          entity="métrica"
        />
      )}
    </>
  )
}
