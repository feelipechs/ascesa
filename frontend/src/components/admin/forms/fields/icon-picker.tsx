'use client'

import { useState } from 'react'
import * as icons from 'lucide-react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { AREA_ICONS } from '@/lib/area-icons'

interface IconPickerProps {
  value: string | null | undefined
  onChange: (name: string) => void
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false)

  const selected = AREA_ICONS.find((i) => i.name === value)

  const grouped = AREA_ICONS.reduce<Record<string, (typeof AREA_ICONS)[number][]>>(
    (acc, icon) => {
    const cat = icon.category ?? 'Outros'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(icon)
    return acc
  }, {} as Record<string, (typeof AREA_ICONS)[number][]>)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selected ? (
            <span className="flex items-center gap-2">
              {(() => {
                const Icon = icons[selected.name as keyof typeof icons] as
                  | React.ElementType
                  | undefined
                return Icon ? <Icon size={16} /> : null
              })()}
              {selected.label}
            </span>
          ) : (
            'Selecionar ícone...'
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Buscar ícone..." />
          <CommandList>
            <CommandEmpty>Nenhum ícone encontrado.</CommandEmpty>
            {Object.entries(grouped).map(([category, items]) => (
              <CommandGroup key={category} heading={category}>
                {items.map((icon) => {
                  const Icon = icons[icon.name as keyof typeof icons] as
                    | React.ElementType
                    | undefined
                  return (
                    <CommandItem
                      key={icon.name}
                      value={icon.label}
                      onSelect={() => {
                        onChange(icon.name)
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          value === icon.name ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {Icon && <Icon size={16} className="mr-2 shrink-0" />}
                      {icon.label}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
