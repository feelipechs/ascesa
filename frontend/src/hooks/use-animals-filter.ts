'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export function useAnimalsFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const searchQuery = searchParams.get('search') ?? ''
  const selectedSpecies = searchParams.get('species') ?? 'all'
  const selectedSize = searchParams.get('size') ?? 'all'
  const selectedStatus = searchParams.get('status') ?? 'all'
  const currentPage = Number(searchParams.get('page') ?? '1')

  function setFilter(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'all') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    if (!('page' in updates)) params.delete('page')
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  function handleSearchChange(value: string) {
    setFilter({ search: value || null })
  }

  function handleSpeciesChange(value: string) {
    setFilter({ species: value })
  }

  function handleSizeChange(value: string) {
    setFilter({ size: value })
  }

  function handleStatusChange(value: string) {
    setFilter({ status: value })
  }

  function handlePageChange(page: number) {
    setFilter({ page: page === 1 ? null : String(page) })
  }

  const filters: Record<string, string | undefined> = {
    ...(searchQuery && { search: searchQuery }),
    ...(selectedSpecies !== 'all' && { species: selectedSpecies }),
    ...(selectedSize !== 'all' && { size: selectedSize }),
    ...(selectedStatus !== 'all' && { status: selectedStatus }),
    page: String(currentPage),
  }

  return {
    searchQuery,
    selectedSpecies,
    selectedSize,
    selectedStatus,
    currentPage,
    filters,
    handleSearchChange,
    handleSpeciesChange,
    handleSizeChange,
    handleStatusChange,
    handlePageChange,
  }
}
