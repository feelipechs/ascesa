// =============================================================================
// src/types/index.ts — Refatorado
// =============================================================================
//
// CRITÉRIO USADO PARA CADA DECISÃO:
//
// Tipo base inclui mídia quando:
//   → o model tem coverMedia/logoMedia/photoMedia e ela é carregada em TODA
//     query que aparece na UI (Partner, Post, Area, Project)
//
// Tipo base NÃO inclui relações quando:
//   → a entidade é usada sem relações em vários contextos diferentes
//     (TeamMember, Volunteer, Registration, DocumentCategory...)
//
// Tipo "WithX" existe quando:
//   → o shape muda de forma incompatível com o base e é usado em 2+ lugares
//
// ListItem existe quando:
//   → a lista precisa de campos que o base não carrega (_count, relações aninhadas)
//     OU a lista é paginada e performance justifica um select enxuto
//
// REMOVIDOS (órfãos ou redundantes confirmados por grep no codebase):
//   - AreaWithProjects     → 0 usos fora deste arquivo
//   - DocumentListItem     → 0 usos fora deste arquivo
//   - ProjectWithCoverMedia → substituído por ProjectListItem (renomeado)
//   - GalleryImage bare    → substituído por GalleryImage (que era GalleryImageWithMedia)
//   - Animal bare          → substituído por AnimalListItem e AnimalWithDetails
//   - TeamMember bare      → importado mas nunca usado como tipo de prop/retorno
//
// RENOMEADOS:
//   - GalleryImageWithMedia → GalleryImage
//   - ProjectWithArea       → ProjectWithDetails (reflete melhor o conteúdo)
//   - AnimalWithIncludes    → AnimalWithDetails (consistência de nomenclatura)
// =============================================================================

import type { ProjectGetPayload } from '@/generated/prisma/models/Project'
import type { AreaGetPayload } from '@/generated/prisma/models/Area'
import type { DocumentGetPayload } from '@/generated/prisma/models/Document'
import type { TeamMemberGetPayload } from '@/generated/prisma/models/TeamMember'
import type { PartnerGetPayload } from '@/generated/prisma/models/Partner'
import type { DocumentCategoryGetPayload } from '@/generated/prisma/models/DocumentCategory'
import type { GalleryImageGetPayload } from '@/generated/prisma/models/GalleryImage'
import type { TestimonialGetPayload } from '@/generated/prisma/models/Testimonial'
import type { SiteSettingsGetPayload } from '@/generated/prisma/models/SiteSettings'
import type { UserGetPayload } from '@/generated/prisma/models/User'
import type { VolunteerGetPayload } from '@/generated/prisma/models/Volunteer'
import type { RegistrationGetPayload } from '@/generated/prisma/models/Registration'
import type { PostGetPayload } from '@/generated/prisma/models/Post'
import type { StatGetPayload } from '@/generated/prisma/models/Stat'
import type { AnimalGetPayload } from '@/generated/prisma/models/Animal'
import type { PaymentMethodGetPayload } from '@/generated/prisma/models/PaymentMethod'
import type { FiscalNoteGetPayload } from '@/generated/prisma/models/FiscalNote'
import type { GalleryContext, Role, RegistrationStatus, AnimalSpecies, AnimalSize, AnimalAgeRange } from '@/generated/prisma/enums'

// ---------------------------------------------------------------------------
// Helper interno — evita repetir o select de mídia em todo lugar
// Não exportado: é só pra reduzir verbosidade aqui dentro
// ---------------------------------------------------------------------------
type MediaSelect = { select: { id: true; url: true } }

// =============================================================================
// BASES — entidades sem relações de imagem obrigatória na UI
// =============================================================================

// Documentos, categorias, testemunhos, stats: nunca precisam de relação no base
export type OngDocument = DocumentGetPayload<{}>
export type DocumentCategory = DocumentCategoryGetPayload<{}>
export type Testimonial = TestimonialGetPayload<{}>
export type SiteSettings = SiteSettingsGetPayload<{}>
export type Stat = StatGetPayload<{}>
export type Volunteer = VolunteerGetPayload<{}>
export type Registration = RegistrationGetPayload<{}>
export type PaymentMethod = PaymentMethodGetPayload<{}>
export type FiscalNote = FiscalNoteGetPayload<{}>

// =============================================================================
// BASES COM MÍDIA — carregada em toda query, faz sentido estar no base
// =============================================================================

// Area: coverMedia usada em AreaCard, página de detalhe e admin — sempre carregada
export type Area = AreaGetPayload<{
  include: { coverMedia: MediaSelect }
}>

// Partner: logoMedia é obrigatório no schema (non-nullable) — sempre carregada
export type Partner = PartnerGetPayload<{
  include: { logoMedia: MediaSelect }
}>

// Post: coverMedia usada em BlogCard, PostDetail, admin — sempre carregada
export type Post = PostGetPayload<{
  include: { coverMedia: MediaSelect }
}>

// Project: coverMedia usada em ProjectCard e admin — sempre carregada
// Nota: o base NÃO inclui area nem gallery — use ProjectListItem ou ProjectWithDetails
export type Project = ProjectGetPayload<{
  include: { coverMedia: MediaSelect }
}>

// =============================================================================
// LISTAGENS — select enxuto com relações necessárias para cards/tabelas
// =============================================================================

// AreaListItem: AreaCard precisa de _count (projetos e membros) que o base não traz
export type AreaListItem = AreaGetPayload<{
  select: {
    id: true
    title: true
    slug: true
    description: true
    iconName: true
    createdAt: true
    updatedAt: true
    coverMedia: MediaSelect
    _count: { select: { projects: true; members: true } }
  }
}>

// ProjectListItem: ProjectCard precisa de area.title — o base não inclui relações
export type ProjectListItem = ProjectGetPayload<{
  select: {
    id: true
    title: true
    slug: true
    description: true
    featured: true
    eventDate: true
    location: true
    vacancies: true
    createdAt: true
    updatedAt: true
    areaId: true
    coverMedia: MediaSelect
    area: { select: { id: true; title: true; slug: true } }
  }
}>

// AnimalListItem: cards de animal — species/size/ageRange são enum escalares
export type AnimalListItem = AnimalGetPayload<{
  select: {
    id: true
    name: true
    slug: true
    description: true
    status: true
    featured: true
    gender: true
    breed: true
    shelterSince: true
    coverMedia: MediaSelect
    species: true
    size: true
    ageRange: true
  }
}>

// DocumentWithCategory: Document sempre é exibido com sua categoria na UI
// (transparência, admin) — o base sem category nunca é usado diretamente
export type DocumentWithCategory = DocumentGetPayload<{
  include: { category: true }
}>

// DocumentCategoryWithCount: lista de categorias no admin mostra contagem de docs
export type DocumentCategoryWithCount = DocumentCategoryGetPayload<{
  include: { _count: { select: { documents: true } } }
}>

// UserListItem: User nunca é exposto com todos os campos (password via Account, sessions)
// O select explícito aqui é proposital e de segurança, não só performance
export type UserListItem = UserGetPayload<{
  select: {
    id: true
    email: true
    name: true
    role: true
    createdAt: true
    updatedAt: true
  }
}>

// =============================================================================
// DETALHES — includes completos para páginas de detalhe
// =============================================================================

// ProjectWithDetails: página de detalhe do projeto (area + gallery)
// Também usado no admin para edição
export type ProjectWithDetails = ProjectGetPayload<{
  include: {
    area: true
    coverMedia: MediaSelect
    gallery: { include: { media: MediaSelect } }
  }
}>

// AreaWithMembers: página de detalhe da área (projects + members + coverMedia)
export type AreaWithMembers = AreaGetPayload<{
  include: {
    coverMedia: MediaSelect
    projects: { include: { coverMedia: MediaSelect } }
    members: {
      include: {
        teamMember: { include: { photoMedia: MediaSelect } }
      }
    }
  }
}>

// TeamMemberWithAreas: admin e página /about (photo + areas vinculadas)
export type TeamMemberWithAreas = TeamMemberGetPayload<{
  include: {
    photoMedia: MediaSelect
    areas: { include: { area: { select: { id: true; title: true } } } }
  }
}>

// AnimalWithDetails: página de detalhe do animal (species/size/ageRange são enums)
export type AnimalWithDetails = AnimalGetPayload<{
  select: {
    id: true
    name: true
    slug: true
    species: true
    breed: true
    gender: true
    size: true
    birthDate: true
    ageRange: true
    shelterSince: true
    description: true
    content: true
    coverMedia: MediaSelect
    status: true
    featured: true
    createdAt: true
    updatedAt: true
    gallery: {
      orderBy: { order: 'asc' }
      select: {
        id: true
        caption: true
        order: true
        media: MediaSelect
      }
    }
  }
}>

// RegistrationWithIncludes: admin de inscrições (voluntário + projeto)
export type RegistrationWithIncludes = RegistrationGetPayload<{
  include: {
    volunteer: { select: { id: true; name: true; email: true; phone: true } }
    project: { select: { id: true; title: true; slug: true; eventDate: true } }
  }
}>

// VolunteerWithRegistrations: detalhe de voluntário no admin
export type VolunteerWithRegistrations = VolunteerGetPayload<{
  include: {
    registrations: {
      include: { project: { select: { id: true; title: true; slug: true } } }
    }
  }
}>

// GalleryImage: mediaId é non-nullable no schema — toda GalleryImage tem media
// O base sem media nunca tem uso real, então este É o tipo padrão
export type GalleryImage = GalleryImageGetPayload<{
  include: { media: MediaSelect }
}>

// =============================================================================
// FILTROS — usados nos hooks de TanStack Query e nas rotas de API
// =============================================================================

export type ProjectFilters = {
  search?: string
  areas?: string[]
  featured?: boolean
  page?: number
  limit?: number
}

export type AreaFilters = {
  search?: string
}

export type DocumentFilters = {
  search?: string
  categoryId?: string
  year?: number
  page?: number
  limit?: number
}

export type GalleryImageFilters = {
  context?: GalleryContext
  projectId?: string
  animalId?: string
}

export type TestimonialFilters = {
  featured?: boolean
}

export type RegistrationFilters = {
  volunteerId?: string
  projectId?: string
  status?: RegistrationStatus
  page?: number
  limit?: number
}

export type VolunteerFilters = {
  search?: string
  page?: number
  limit?: number
}

export type UserFilters = {
  page?: number
  limit?: number
}

export type PostFilters = {
  search?: string
  page?: number
  limit?: number
}

export type AnimalFilters = {
  species?: string
  size?: string
  ageRange?: string
  gender?: string
  status?: string
  search?: string
  featured?: boolean
  page?: number
  limit?: number
}

// =============================================================================
// RESPOSTAS DE API — wrappers genéricos usados em lib/api e hooks
// =============================================================================

export type ApiResponse<T> =
  | { data: T; error?: never }
  | { data?: never; error: { message: string } }

export type PaginatedResponse<T> = {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// =============================================================================
// REEXPORTE DE ENUMS — conveniência para importar de um lugar só
// =============================================================================

export type { Role, RegistrationStatus, GalleryContext, AnimalSpecies, AnimalSize, AnimalAgeRange }
