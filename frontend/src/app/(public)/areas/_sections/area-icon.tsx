'use client'

import { areaIconMap } from '@/lib/area-icon-map'

interface AreaIconProps {
  name: string | null | undefined
  size?: number
  className?: string
}

export function AreaIcon({ name, size = 24, className }: AreaIconProps) {
  if (!name) return null
  const Icon = areaIconMap[name]
  if (!Icon) return null
  return <Icon size={size} className={className} />
}
