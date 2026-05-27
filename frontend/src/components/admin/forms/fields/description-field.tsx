'use client'

import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

type DescriptionFieldProps = {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  rows?: number
}

export function DescriptionField({ value, onChange, disabled, rows = 4 }: DescriptionFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="description">Descrição</Label>
      <Textarea
        id="description"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={rows}
      />
    </div>
  )
}
