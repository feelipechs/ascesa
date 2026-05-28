import {
  IconUserPlus,
  IconFolder,
  IconFileText,
  IconPaw,
  IconArrowsSort,
  IconMoneybag,
  IconMessage,
  IconReceipt,
  IconUserCircle,
  IconLayoutGrid,
  IconUsers,
  IconHeart,
  IconFile,
  IconPhoto,
} from '@tabler/icons-react'

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type SectionCardsProps = {
  areas: number
  projects: number
  volunteers: number
  posts: number
  animals: number
  species: number
  paymentMethods: number
  testimonials: number
  fiscalNotes: number
  users: number
  teamMembers: number
  partners: number
  documents: number
  galleryImages: number
}

export function SectionCards({
  areas,
  projects,
  volunteers,
  posts,
  animals,
  species,
  paymentMethods,
  testimonials,
  fiscalNotes,
  users,
  teamMembers,
  partners,
  documents,
  galleryImages,
}: SectionCardsProps) {
  const cards = [
    { icon: IconUserPlus, label: 'Voluntários', value: volunteers },
    { icon: IconFolder, label: 'Projetos', value: projects },
    { icon: IconFileText, label: 'Blog', value: posts },
    { icon: IconPaw, label: 'Animais', value: animals },
    { icon: IconArrowsSort, label: 'Espécies', value: species },
    { icon: IconMoneybag, label: 'Pagamentos', value: paymentMethods },
    { icon: IconMessage, label: 'Depoimentos', value: testimonials },
    { icon: IconReceipt, label: 'Notas Fiscais', value: fiscalNotes },
    { icon: IconUserCircle, label: 'Usuários', value: users },
    { icon: IconLayoutGrid, label: 'Áreas', value: areas },
    { icon: IconUsers, label: 'Membros da Equipe', value: teamMembers },
    { icon: IconHeart, label: 'Parceiros', value: partners },
    { icon: IconFile, label: 'Documentos', value: documents },
    { icon: IconPhoto, label: 'Galeria', value: galleryImages },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 @7xl/main:grid-cols-5">
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
