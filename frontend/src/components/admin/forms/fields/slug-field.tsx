'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type SlugFieldProps = {
  value: string
  onChange: (value: string) => void
  previewUrl: string
  disabled?: boolean
}

export function SlugField({ value, onChange, previewUrl, disabled }: SlugFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="slug">Slug</Label>
      <Input
        id="slug"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        disabled={disabled}
        className="text-muted-foreground text-sm"
      />
      <p className="text-xs text-muted-foreground">URL: /{previewUrl}/{value}</p>
    </div>
  )
}
