'use client'

import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type DeleteDialogProps = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  entity: string
  isPending?: boolean
  description?: string
  children?: ReactNode
}

export function DeleteDialog({
  open,
  onClose,
  onConfirm,
  entity,
  isPending,
  description = 'Esta ação não pode ser desfeita.',
  children,
}: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir {entity}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isPending}>
            {isPending ? 'Excluindo...' : 'Excluir'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
