import {
  UserPlus,
  Folder,
  FileText,
  PawPrint,
  ArrowUpDown,
  Wallet,
  MessageSquare,
  Receipt,
  UserCircle,
  LayoutGrid,
  Users,
  Heart,
  File,
  Image,
} from 'lucide-react'

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
    { icon: UserPlus, label: 'Voluntários', value: volunteers },
    { icon: Folder, label: 'Projetos', value: projects },
    { icon: FileText, label: 'Blog', value: posts },
    { icon: PawPrint, label: 'Animais', value: animals },
    { icon: Wallet, label: 'Pagamentos', value: paymentMethods },
    { icon: MessageSquare, label: 'Depoimentos', value: testimonials },
    { icon: Receipt, label: 'Notas Fiscais', value: fiscalNotes },
    { icon: UserCircle, label: 'Usuários', value: users },
    { icon: LayoutGrid, label: 'Áreas', value: areas },
    { icon: Users, label: 'Membros da Equipe', value: teamMembers },
    { icon: Heart, label: 'Parceiros', value: partners },
    { icon: File, label: 'Documentos', value: documents },
    { icon: Image, label: 'Galeria', value: galleryImages },
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
