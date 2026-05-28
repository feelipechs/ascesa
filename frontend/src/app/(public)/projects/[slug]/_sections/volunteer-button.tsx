'use client'
import { Button } from '@/components/ui/button'
import { VolunteerModal } from '@/components/volunteer-modal'

type VolunteerButtonProps = {
  projectId: string
  projectTitle: string
}

export function VolunteerButton({ projectId, projectTitle }: VolunteerButtonProps) {
  return (
    <VolunteerModal projectId={projectId} projectTitle={projectTitle}>
      <Button className="w-full">Quero ser voluntário</Button>
    </VolunteerModal>
  )
}
