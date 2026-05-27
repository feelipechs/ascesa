'use client'

import { useState, useMemo } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Plus, Link as LinkIcon } from 'lucide-react'
import { TeamSection } from './team-section'
import { useTeamMembers, useTeamMemberMutations } from '@/hooks/team-members/queries'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import type { TeamMemberWithAreas } from '@/types'

type TeamSectionWrapperProps = {
  isAuthenticated?: boolean
  areaId: string
}

export function TeamSectionWrapper({ isAuthenticated, areaId }: TeamSectionWrapperProps) {
  const { data: allMembers } = useTeamMembers()
  const { update } = useTeamMemberMutations()
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [unlinkingMember, setUnlinkingMember] = useState<TeamMemberWithAreas | null>(null)

  const linkedMembers = useMemo(
    () => (allMembers ?? []).filter((m) => m.areas.some((a) => a.area.id === areaId)),
    [allMembers, areaId]
  )

  const linkedIds = useMemo(() => new Set(linkedMembers.map((m) => m.id)), [linkedMembers])
  const availableMembers = useMemo(
    () => (allMembers ?? []).filter((m) => !linkedIds.has(m.id)),
    [allMembers, linkedIds]
  )

  function handleLink(member: TeamMemberWithAreas) {
    const currentAreaIds = member.areas.map((a) => a.area.id)
    update.mutate(
      { id: member.id, data: { areaIds: [...currentAreaIds, areaId] } },
      { onSuccess: () => setPopoverOpen(false) }
    )
  }

  function handleUnlink() {
    if (!unlinkingMember) return
    const currentAreaIds = unlinkingMember.areas.map((a) => a.area.id)
    const updatedAreaIds = currentAreaIds.filter((id) => id !== areaId)
    update.mutate(
      { id: unlinkingMember.id, data: { areaIds: updatedAreaIds } },
      { onSuccess: () => setUnlinkingMember(null) }
    )
  }

  return (
    <div className="space-y-6">
      {isAuthenticated && (
        <div className="flex justify-end">
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Vincular membro
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0" align="end">
              <Command>
                <CommandInput placeholder="Buscar membro..." />
                <CommandList>
                  <CommandEmpty>Nenhum membro disponível.</CommandEmpty>
                  <CommandGroup heading="Membros">
                    {availableMembers.map((member) => (
                      <CommandItem
                        key={member.id}
                        value={member.name}
                        onSelect={() => handleLink(member)}
                      >
                        <LinkIcon className="mr-2 h-4 w-4" />
                        {member.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      )}

      <TeamSection
        members={linkedMembers}
        isAuthenticated={isAuthenticated}
        onDelete={(member) => {
          const fullMember = allMembers?.find((m) => m.id === member.id)
          if (fullMember) setUnlinkingMember(fullMember)
        }}
      />

      <Dialog open={!!unlinkingMember} onOpenChange={() => setUnlinkingMember(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover membro</DialogTitle>
            <DialogDescription>
              {unlinkingMember?.name} será removido desta área.
              {unlinkingMember && unlinkingMember.areas.length > 1 && (
                <span className="block mt-2">
                  Este membro pertence a {unlinkingMember.areas.length} área(s):
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          {unlinkingMember && unlinkingMember.areas.length > 1 && (
            <div className="px-6">
              <ul className="space-y-1">
                {unlinkingMember.areas.map((a) => (
                  <li key={a.area.id} className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {a.area.title}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setUnlinkingMember(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleUnlink}>
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
