'use client'

import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

type AdminActionsProps = {
  onEdit?: () => void
  onDelete: () => void
  isDeleting?: boolean
}

export function AdminActions({ onEdit, onDelete, isDeleting }: AdminActionsProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg border bg-background/95 p-1 shadow-sm backdrop-blur">
      {onEdit && (
        <Button size="icon" variant="ghost" onClick={onEdit} className="h-8 w-8">
          <Pencil className="h-4 w-4" />
        </Button>
      )}
      <Button
        size="icon"
        variant="ghost"
        onClick={onDelete}
        disabled={isDeleting}
        className="h-8 w-8 text-destructive hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
