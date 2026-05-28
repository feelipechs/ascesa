'use client'
import { useState } from 'react'
import { useSettings } from '@/hooks/settings/queries'
import { useTeamMembers, useTeamMemberMutations } from '@/hooks/team-members/queries'
import type { TeamMemberWithAreas } from '@/types'
import { AboutHistory } from './about-history'
import { AboutMvv } from './about-mvv'
import { AboutTeam } from './about-team'
import { AdminSheet } from '@/components/admin/admin-sheet'
import { TeamMemberForm } from '@/components/admin/forms/team-member-form'
import { DeleteDialog } from '@/components/delete-dialog'

type AboutContentProps = {
  isAuthenticated?: boolean
}

export function AboutContent({ isAuthenticated }: AboutContentProps) {
  const { data: settings } = useSettings()
  const { data: teamMembers } = useTeamMembers()
  const { remove, isPending } = useTeamMemberMutations()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<null | { id: string }>(null)
  const [deletingMember, setDeletingMember] = useState<TeamMemberWithAreas | null>(null)

  function handleNew() {
    setEditingMember(null)
    setSheetOpen(true)
  }

  function handleEdit(member: { id: string }) {
    setEditingMember(member)
    setSheetOpen(true)
  }

  function handleSheetClose() {
    setSheetOpen(false)
    setEditingMember(null)
  }

  return (
    <>
      <AboutHistory about={settings?.about} />
      <AboutMvv mission={settings?.mission} vision={settings?.vision} values={settings?.values} />
      <AboutTeam
        teamMembers={teamMembers ?? []}
        isAuthenticated={isAuthenticated}
        onAdd={handleNew}
        onEdit={handleEdit}
        onDelete={(member) => {
          const full = teamMembers?.find((m) => m.id === member.id)
          if (full) setDeletingMember(full)
        }}
      />

      {isAuthenticated && (
        <>
          <AdminSheet
            open={sheetOpen}
            onClose={handleSheetClose}
            title={editingMember ? 'Editar membro' : 'Novo membro'}
          >
            <TeamMemberForm
              memberId={editingMember?.id}
              onSuccess={handleSheetClose}
              onCancel={handleSheetClose}
            />
          </AdminSheet>

          <DeleteDialog
            open={!!deletingMember}
            onClose={() => setDeletingMember(null)}
            onConfirm={() => {
              if (deletingMember)
                remove.mutate(deletingMember.id, { onSuccess: () => setDeletingMember(null) })
            }}
            isPending={isPending}
            entity="membro"
          >
            {deletingMember && deletingMember.areas.length > 0 && (
              <div className="px-6 pb-2">
                <p className="text-sm text-muted-foreground mb-2">
                  Este membro está vinculado a {deletingMember.areas.length} área(s):
                </p>
                <ul className="space-y-1">
                  {deletingMember.areas.map((a) => (
                    <li key={a.area.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      {a.area.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </DeleteDialog>
        </>
      )}
    </>
  )
}
