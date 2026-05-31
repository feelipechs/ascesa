'use client'

import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { SafeImage } from '@/components/safe-image'
import { AdminActions } from '@/components/admin/admin-actions'
import { EmptyState } from '@/components/empty-state'
import { PageSection } from '@/components/page-section'
import { SectionHeading } from '@/components/section-heading'
import { SortableList, SortableItem } from '@/components/sortable-list'
import { GripVertical } from 'lucide-react'
import type { TeamMember } from '@/types'

type AboutTeamProps = {
  teamMembers: TeamMember[]
  isAuthenticated?: boolean
  onEdit?: (member: TeamMember) => void
  onDelete?: (member: TeamMember) => void
  onAdd?: () => void
  onReorder?: (activeIndex: number, overIndex: number) => void
}

export function AboutTeam({
  teamMembers,
  isAuthenticated,
  onEdit,
  onDelete,
  onAdd,
  onReorder,
}: AboutTeamProps) {
  const membersList = teamMembers.length > 0 ? (
    isAuthenticated && onReorder ? (
      <SortableList items={teamMembers} onReorder={onReorder}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-10 xl:grid-cols-4 animate-in fade-in-0 duration-500">
          {teamMembers.map((member) => (
            <SortableItem key={member.id} id={member.id}>
              {({ attributes, listeners, isDragging }) => (
                <Card
                  className={`hover:border-primary group relative flex h-full flex-col overflow-hidden py-0 shadow-none transition-colors duration-300 ${isDragging ? 'opacity-50' : ''}`}
                >
                  <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
                    <button
                      {...attributes}
                      {...listeners}
                      className="cursor-grab active:cursor-grabbing touch-none flex items-center justify-center h-8 w-8 rounded-md bg-background/95 backdrop-blur shadow-sm border hover:bg-muted"
                    >
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </button>
                    {onDelete && (
                      <AdminActions
                        onEdit={onEdit ? () => onEdit(member) : undefined}
                        onDelete={() => onDelete(member)}
                      />
                    )}
                  </div>
                  <CardContent className="flex-1 flex flex-col px-0">
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
              )}
            </SortableItem>
          ))}
        </div>
      </SortableList>
    ) : (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-10 xl:grid-cols-4 animate-in fade-in-0 duration-500">
        {teamMembers.map((member) => (
        <Card
          key={member.id}
          className="hover:border-primary group relative flex h-full flex-col overflow-hidden py-0 shadow-none transition-colors duration-300"
        >
            {isAuthenticated && onDelete && (
              <div className="absolute top-2 right-2 z-10">
                <AdminActions
                  onEdit={onEdit ? () => onEdit(member) : undefined}
                  onDelete={() => onDelete(member)}
                />
              </div>
            )}
        <CardContent className="flex-1 flex flex-col px-0">
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
    )
  ) : (
    <EmptyState title="Nenhum membro da equipe cadastrado." />
  )

  return (
    <PageSection width="wide" padding="compact">
      <SectionHeading
        title="Nossa Equipe"
        description="Conheça os profissionais dedicados que fazem a Ascesa acontecer todos os dias."
        action={isAuthenticated && onAdd ? { label: 'Adicionar', onClick: onAdd } : undefined}
      />
      {membersList}
    </PageSection>
  )
}
