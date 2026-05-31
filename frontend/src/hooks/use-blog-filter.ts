'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export function useBlogFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const searchQuery = searchParams.get('search') ?? ''
  const currentPage = Number(searchParams.get('page') ?? '1')

  function setFilter(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    if (!('page' in updates)) params.delete('page')
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setFilter({ search: e.target.value })
  }

  function handlePageChange(page: number) {
    setFilter({ page: page === 1 ? null : String(page) })
  }

  return { searchQuery, currentPage, handleSearch, handlePageChange }
}
