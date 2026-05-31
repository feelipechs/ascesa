'use client'

import * as React from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

type BlogFiltersProps = {
  searchQuery: string
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function BlogFilters({ searchQuery, onSearchChange }: BlogFiltersProps) {
  const [inputValue, setInputValue] = React.useState(searchQuery)

  React.useEffect(() => {
    setInputValue(searchQuery)
  }, [searchQuery])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value)
    onSearchChange(e)
  }

  function handleCompositionEnd(e: React.CompositionEvent<HTMLInputElement>) {
    onSearchChange({
      target: { value: (e.target as HTMLInputElement).value },
    } as React.ChangeEvent<HTMLInputElement>)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 animate-in fade-in-0 duration-500">
      <div className="relative flex items-center w-full sm:max-w-sm">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none shrink-0" />
        <Input
          placeholder="Buscar posts..."
          value={inputValue}
          onChange={handleChange}
          onCompositionEnd={handleCompositionEnd}
          className="pl-9"
        />
      </div>
    </div>
  )
}
