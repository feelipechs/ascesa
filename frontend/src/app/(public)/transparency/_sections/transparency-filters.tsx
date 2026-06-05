'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type TransparencyFiltersProps = {
  categories: { id: string; name: string; _count: { documents: number } }[] | undefined
  availableYears: number[]
  selectedCategory: string | undefined
  selectedYear: number | undefined
  onCategoryChange: (value: string | undefined) => void
  onYearChange: (value: number | undefined) => void
}

export function TransparencyFilters({
  categories,
  availableYears,
  selectedCategory,
  selectedYear,
  onCategoryChange,
  onYearChange,
}: TransparencyFiltersProps) {
  return (
    <div className="mb-8 flex flex-wrap gap-4 items-center">
      <Select
        value={selectedCategory ?? 'all'}
        onValueChange={(v) => onCategoryChange(v === 'all' ? undefined : v)}
      >
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as categorias</SelectItem>
          {categories?.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name} ({cat._count.documents})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedYear?.toString() ?? 'all'}
        onValueChange={(v) => onYearChange(v === 'all' ? undefined : Number(v))}
      >
        <SelectTrigger className="w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os anos</SelectItem>
          {availableYears.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
