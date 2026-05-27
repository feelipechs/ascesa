'use client'

import * as React from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from '@/components/ui/multi-select'
import { useAreas } from '@/hooks/areas/queries'

type ProjectsFiltersProps = {
  searchQuery: string
  selectedAreas: string[]
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onAreasChange: (values: string[]) => void
}

export function ProjectsFilters({
  searchQuery,
  selectedAreas,
  onSearchChange,
  onAreasChange,
}: ProjectsFiltersProps) {
  const [inputValue, setInputValue] = React.useState(searchQuery)
  const { data: areas = [] } = useAreas()

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
          placeholder="Buscar projetos..."
          value={inputValue}
          onChange={handleChange}
          onCompositionEnd={handleCompositionEnd}
          className="pl-9"
        />
      </div>

      <MultiSelect values={selectedAreas} onValuesChange={onAreasChange}>
        <MultiSelectTrigger className="w-full sm:max-w-xs">
          <MultiSelectValue placeholder="Filtrar por área..." />
        </MultiSelectTrigger>
        <MultiSelectContent
          search={{ placeholder: 'Buscar área...', emptyMessage: 'Nenhuma área encontrada.' }}
        >
          {areas.map((area) => (
            <MultiSelectItem key={area.id} value={area.slug}>
              {area.title}
            </MultiSelectItem>
          ))}
        </MultiSelectContent>
      </MultiSelect>
    </div>
  )
}
