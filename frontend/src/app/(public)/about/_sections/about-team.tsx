'use client'

import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { SafeImage } from '@/components/safe-image'
import { AdminActions } from '@/components/admin/admin-actions'
import { EmptyState } from '@/components/empty-state'
import { PageSection } from '@/components/page-section'
import { SectionHeading } from '@/components/section-heading'
import type { TeamMember } from '@/types'

type AboutTeamProps = {
  teamMembers: TeamMember[]
  isAuthenticated?: boolean
  onEdit?: (member: TeamMember) => void
  onDelete?: (member: TeamMember) => void
  onAdd?: () => void
}

export function AboutTeam({
  teamMembers,
  isAuthenticated,
  onEdit,
  onDelete,
  onAdd,
}: AboutTeamProps) {
  return (
    <PageSection width="wide" padding="compact">
      <SectionHeading
        title="Nossa Equipe"
        description="Conheça os profissionais dedicados que fazem a Ascesa acontecer todos os dias."
        action={isAuthenticated && onAdd ? { label: 'Adicionar', onClick: onAdd } : undefined}
      />

      {teamMembers.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-10 xl:grid-cols-4 animate-in fade-in-0 duration-500">
          {teamMembers.map((member) => (
            <Card
              key={member.id}
              className="hover:border-primary group relative overflow-hidden py-0 shadow-none transition-colors duration-300"
            >
              {isAuthenticated && onDelete && (
                <div className="absolute top-2 right-2 z-10">
                  <AdminActions
                    onEdit={onEdit ? () => onEdit(member) : undefined}
                    onDelete={() => onDelete(member)}
                  />
                </div>
              )}
              <CardContent className="px-0">
                {member.photoUrl && (
                  <div className="flex justify-center bg-muted pt-10">
                    <SafeImage
                      src={member.photoUrl}
                      alt={member.name}
                      width={240}
                      height={240}
                      className="h-60 w-60 rounded-lg object-cover"
                    />
                  </div>
                )}
                <div className="space-y-3 p-6">
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <Separator />
                  <div className="text-muted-foreground">
                    <p className="mb-1 font-medium">{member.role}</p>
                    {member.bio && <p>{member.bio}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="Nenhum membro da equipe cadastrado." />
      )}
    </PageSection>
  )
}
