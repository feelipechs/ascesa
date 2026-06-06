'use client'

import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Loader2, Clock, UserCheck, X, Trash2 } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/data-table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DeleteDialog } from '@/components/delete-dialog'
import { useRegistrationMutations } from '@/hooks/registrations/queries'
import { toast } from 'sonner'

type RegistrationRow = {
  id: string
  status: string
  volunteerName: string
  volunteerEmail: string
  volunteerPhone: string | null
  message: string | null
}

type ProjectVolunteersSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectTitle: string
  registrations: RegistrationRow[]
}

export function ProjectVolunteersSheet({
  open,
  onOpenChange,
  projectTitle,
  registrations,
}: ProjectVolunteersSheetProps) {
  const [pendingChanges, setPendingChanges] = useState<Record<string, string>>({})
  const { updateStatus, remove } = useRegistrationMutations()
  const [isSaving, setIsSaving] = useState(false)
  const [deletingRegistration, setDeletingRegistration] = useState<null | { id: string; name: string }>(null)

  const changedIds = Object.keys(pendingChanges)
  const hasChanges = changedIds.length > 0

  const approvedCount = changedIds.filter((id) => pendingChanges[id] === 'APPROVED').length
  const rejectedCount = changedIds.filter((id) => pendingChanges[id] === 'REJECTED').length

  async function handleSave() {
    setIsSaving(true)
    let successCount = 0
    let errorCount = 0

    for (const [id, status] of Object.entries(pendingChanges)) {
      try {
        await updateStatus.mutateAsync({ id, data: { status } })
        successCount++
      } catch (error) {
        errorCount++
        console.error(`Falha ao atualizar inscrição ${id}:`, error)
      }
    }

    setIsSaving(false)
    setPendingChanges({})

    if (errorCount === 0) {
      toast.success(`${successCount} inscrição(ões) atualizada(s) e notificação(ões) enviada(s).`)
    } else {
      toast.warning(`${successCount} atualizada(s), ${errorCount} com erro.`, {
        description: 'Algumas notificações podem não ter sido enviadas.',
      })
    }

    if (errorCount < Object.keys(pendingChanges).length) {
      onOpenChange(false)
    }
  }

  function handleStatusChange(regId: string, newStatus: string) {
    const originalStatus = registrations.find((r) => r.id === regId)?.status
    if (newStatus === originalStatus) {
      const next = { ...pendingChanges }
      delete next[regId]
      setPendingChanges(next)
    } else {
      setPendingChanges((prev) => ({ ...prev, [regId]: newStatus }))
    }
  }

  function getCurrentStatus(regId: string): string {
    return pendingChanges[regId] ?? registrations.find((r) => r.id === regId)?.status ?? 'PENDING'
  }

  const columns: ColumnDef<RegistrationRow>[] = [
    {
      accessorKey: 'volunteerName',
      header: 'Nome',
      cell: ({ getValue, row }) => (
        <div>
          <span className="font-medium">{getValue() as string}</span>
          {pendingChanges[row.original.id] && (
            <Badge variant="outline" className="ml-2 text-[10px] px-1.5 py-0">
              alterado
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'volunteerEmail',
      header: 'Email',
      cell: ({ getValue }) => (
        <span className="text-muted-foreground text-xs">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: 'volunteerPhone',
      header: 'Telefone',
      cell: ({ getValue }) => {
        const phone = getValue() as string | null
        return <span className="text-muted-foreground text-xs">{phone ?? '—'}</span>
      },
    },
    {
      accessorKey: 'message',
      header: 'Mensagem',
      cell: ({ getValue }) => {
        const msg = getValue() as string | null
        if (!msg) return <span className="text-muted-foreground">—</span>
        return (
          <span className="text-xs line-clamp-2" title={msg}>
            {msg}
          </span>
        )
      },
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Select
            value={getCurrentStatus(row.original.id)}
            onValueChange={(value) => handleStatusChange(row.original.id, value)}
          >
            <SelectTrigger className="h-8 w-32 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">
                <Clock className="h-3 w-3 mr-1 inline" /> Pendente
              </SelectItem>
              <SelectItem value="APPROVED">
                <UserCheck className="h-3 w-3 mr-1 inline" /> Aprovado
              </SelectItem>
              <SelectItem value="REJECTED">
                <X className="h-3 w-3 mr-1 inline" /> Rejeitado
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() =>
              setDeletingRegistration({
                id: row.original.id,
                name: row.original.volunteerName,
              })
            }
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-2xl flex flex-col" showCloseButton>
        <SheetHeader>
          <SheetTitle>Voluntários — {projectTitle}</SheetTitle>
          <SheetDescription>
            {registrations.length} inscrito{registrations.length !== 1 ? 's' : ''} neste projeto.
            Altere o status e clique em &quot;Salvar e notificar&quot; para confirmar.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-auto px-4">
          {registrations.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhum voluntário inscrito neste projeto.
            </p>
          ) : (
            <DataTable columns={columns} data={registrations} searchKey="volunteerName" />
          )}
        </div>

        {hasChanges && (
          <SheetFooter className="border-t">
            <div className="flex items-center justify-between w-full gap-4">
              <div className="text-sm text-muted-foreground">
                {approvedCount > 0 && (
                  <span className="text-green-600 font-medium">{approvedCount} aprovação(ões)</span>
                )}
                {approvedCount > 0 && rejectedCount > 0 && ' · '}
                {rejectedCount > 0 && (
                  <span className="text-destructive font-medium">{rejectedCount} rejeição(ões)</span>
                )}
              </div>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSaving ? 'Salvando...' : 'Salvar e notificar'}
              </Button>
            </div>
        </SheetFooter>
      )}

      <DeleteDialog
        open={!!deletingRegistration}
        onClose={() => setDeletingRegistration(null)}
        onConfirm={() => {
          if (deletingRegistration) {
            remove.mutate(deletingRegistration.id, {
              onSuccess: () => {
                setDeletingRegistration(null)
                const next = { ...pendingChanges }
                delete next[deletingRegistration.id]
                setPendingChanges(next)
              },
            })
          }
        }}
        isPending={remove.isPending}
        entity={`inscrição de ${deletingRegistration?.name ?? ''}`}
      />
    </SheetContent>
  </Sheet>
  )
}
