'use client'

import { SafeImage } from '@/components/safe-image'
import { EmptyState } from '@/components/empty-state'
import { AdminActions } from '@/components/admin/admin-actions'
import type { TeamMember } from '@/types'

type TeamSectionProps = {
  members: TeamMember[]
  isAuthenticated?: boolean
  onEdit?: (member: TeamMember) => void
  onDelete?: (member: TeamMember) => void
}

export function TeamSection({ members, isAuthenticated, onEdit, onDelete }: TeamSectionProps) {
  if (members.length === 0) {
    return <EmptyState title="Ainda não há membros cadastrados nesta área." className="py-12" />
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {members.map((member, index) => (
        <div
          key={member.id}
          className="group relative flex flex-col items-center rounded-xl border bg-card p-6 text-center transition-shadow hover:shadow-md"
        >
          {isAuthenticated && onDelete && (
            <div className="absolute top-2 right-2 z-10">
              <AdminActions onEdit={onEdit ? () => onEdit(member) : undefined} onDelete={() => onDelete(member)} />
            </div>
          )}
          {member.photoUrl ? (
            <SafeImage
              src={member.photoUrl}
              alt={member.name}
              width={80}
              height={80}
              className="mb-4 h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
              {member.name.charAt(0)}
            </div>
          )}
          <h3 className="mb-1 font-semibold truncate max-w-full">{member.name}</h3>
          <p className="text-sm text-muted-foreground truncate max-w-full">{member.role}</p>
        </div>
      ))}
    </div>
  )
}
