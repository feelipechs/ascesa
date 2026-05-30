'use client'

import * as icons from 'lucide-react'

interface AreaIconProps {
  name: string | null | undefined
  size?: number
  className?: string
}

export function AreaIcon({ name, size = 24, className }: AreaIconProps) {
  if (!name) return null
  const Icon = icons[name as keyof typeof icons] as React.ElementType | undefined
  if (!Icon) return null
  return <Icon size={size} className={className} />
}
