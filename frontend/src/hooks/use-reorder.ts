import { useState, useCallback, useEffect } from 'react'

export function useReorder<T extends { id: string }>(items: T[], options?: { field?: string }) {
  const field = options?.field ?? 'order'
  const [optimisticItems, setOptimisticItems] = useState(items)
  const [serverItems, setServerItems] = useState(items)

  useEffect(() => {
    setServerItems(items)
    setOptimisticItems(items)
  }, [items])

  const reorder = useCallback(
    (activeIndex: number, overIndex: number) => {
      if (activeIndex === overIndex) return

      const updated = [...optimisticItems]
      const [moved] = updated.splice(activeIndex, 1)
      updated.splice(overIndex, 0, moved)

      const reordered = updated.map((item, i) => ({
        ...item,
        [field]: i,
      }))

      setOptimisticItems(reordered)
      return reordered
    },
    [optimisticItems, field]
  )

  const reset = useCallback(() => {
    setOptimisticItems(serverItems)
  }, [serverItems])

  return {
    optimisticItems,
    reorder,
    reset,
    setOptimisticItems,
  }
}
