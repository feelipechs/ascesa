'use client'

import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'
import { AnimalStatus } from '@/generated/prisma/enums'
import { speciesOptions, sizeOptions } from '@/lib/animal-labels'

const statusOptions: { value: AnimalStatus; label: string }[] = [
  { value: AnimalStatus.AVAILABLE, label: 'Disponível' },
  { value: AnimalStatus.ADOPTED, label: 'Adotado' },
  { value: AnimalStatus.FOSTERED, label: 'Lar Temporário' },
]

type AnimalsFiltersProps = {
  searchQuery: string
  selectedSpecies: string
  selectedSize: string
  selectedStatus: string
  onSearchChange: (value: string) => void
  onSpeciesChange: (value: string) => void
  onSizeChange: (value: string) => void
  onStatusChange: (value: string) => void
}

export function AnimalsFilters({
  searchQuery,
  selectedSpecies,
  selectedSize,
  selectedStatus,
  onSearchChange,
  onSpeciesChange,
  onSizeChange,
  onStatusChange,
}: AnimalsFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select value={selectedSpecies} onValueChange={onSpeciesChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Espécie" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas</SelectItem>
          {speciesOptions.map((s) => (
            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedSize} onValueChange={onSizeChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Porte" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {sizeOptions.map((s) => (
            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedStatus} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {statusOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
