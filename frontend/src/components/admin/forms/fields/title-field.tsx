'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type TitleFieldProps = {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function TitleField({ value, onChange, disabled }: TitleFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="title">Título</Label>
      <Input
        id="title"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required
      />
    </div>
  )
}
