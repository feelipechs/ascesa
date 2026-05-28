'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

type SectionHeadingProps = {
  title: React.ReactNode
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function SectionHeading({ title, description, action }: SectionHeadingProps) {
  return (
    <div className="mb-8 flex items-center justify-between gap-4">
      <div className="space-y-2 text-center flex-1">
        <h2 className="text-2xl font-semibold md:text-3xl lg:text-4xl">{title}</h2>
        {description && <p className="text-muted-foreground text-lg">{description}</p>}
      </div>
      {action && (
        <Button size="sm" onClick={action.onClick} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          {action.label}
        </Button>
      )}
    </div>
  )
}
