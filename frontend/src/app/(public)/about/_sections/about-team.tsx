'use client'

import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { SafeImage } from '@/components/shared/safe-image'
import { AdminActions } from '@/components/admin/admin-actions'
import type { TeamMember } from '@/types'

type AboutTeamProps = {
  teamMembers: TeamMember[]
  isAuthenticated?: boolean
  onEdit?: (member: TeamMember) => void
  onDelete?: (member: TeamMember) => void
  onAdd?: () => void
}

export function AboutTeam({ teamMembers, isAuthenticated, onEdit, onDelete, onAdd }: AboutTeamProps) {
  return (
    <section className="py-8 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-center justify-between gap-4">
          <div className="text-center flex-1">
            <h2 className="mb-4 text-2xl font-semibold md:text-3xl lg:text-4xl">Nossa Equipe</h2>
            <p className="text-muted-foreground text-xl">
              Conheça os profissionais dedicados que fazem a Ascesa acontecer todos os dias.
            </p>
          </div>
          {isAuthenticated && onAdd && (
            <Button size="sm" onClick={onAdd} className="shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-10 xl:grid-cols-4 animate-in fade-in-0 duration-500">
          {teamMembers.map((member) => (
            <Card
              key={member.id}
              className="hover:border-primary group relative overflow-hidden py-0 shadow-none transition-colors duration-300"
            >
              {isAuthenticated && onDelete && (
                <div className="absolute top-2 right-2 z-10">
                  <AdminActions onEdit={onEdit ? () => onEdit(member) : undefined} onDelete={() => onDelete(member)} />
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
      </div>
    </section>
  )
}
