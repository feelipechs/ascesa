import {
  IconFolder,
  IconMapPin,
  IconUsers,
  IconHeartHandshake,
  IconFileText,
  IconUserPlus,
  IconActivity,
  IconUserCircle,
  IconNews,
  IconCalendarEvent,
  IconFlag,
} from '@tabler/icons-react'

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type SectionCardsProps = {
  projects: number
  events: number
  campaigns: number
  areas: number
  teamMembers: number
  partners: number
  documents: number
  volunteers: number
  pendingRegistrations: number
  users: number
  posts: number
}

export function SectionCards({
  projects, events, campaigns, areas, teamMembers, partners,
  documents, volunteers, pendingRegistrations, users, posts,
}: SectionCardsProps) {
  const cards = [
    { icon: IconFolder, label: 'Projetos', value: projects },
    { icon: IconCalendarEvent, label: 'Eventos', value: events },
    { icon: IconFlag, label: 'Campanhas', value: campaigns },
    { icon: IconMapPin, label: 'Áreas', value: areas },
    { icon: IconUsers, label: 'Membros', value: teamMembers },
    { icon: IconHeartHandshake, label: 'Parceiros', value: partners },
    { icon: IconFileText, label: 'Documentos', value: documents },
    { icon: IconUserPlus, label: 'Voluntários', value: volunteers },
    { icon: IconActivity, label: 'Inscrições Pendentes', value: pendingRegistrations },
    { icon: IconNews, label: 'Posts', value: posts },
    { icon: IconUserCircle, label: 'Usuários', value: users },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} className="@container/card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <card.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardDescription>{card.label}</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums">
                  {card.value}
                </CardTitle>
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
