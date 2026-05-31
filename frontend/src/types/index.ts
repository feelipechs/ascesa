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
import type { AnimalSpeciesGetPayload } from '@/generated/prisma/models/AnimalSpecies'
import type { AnimalSizeGetPayload } from '@/generated/prisma/models/AnimalSize'
import type { AnimalAgeRangeGetPayload } from '@/generated/prisma/models/AnimalAgeRange'
import type { AnimalGetPayload } from '@/generated/prisma/models/Animal'
import type { PaymentMethodGetPayload } from '@/generated/prisma/models/PaymentMethod'
import type { FiscalNoteGetPayload } from '@/generated/prisma/models/FiscalNote'
import type { GalleryContext } from '@/generated/prisma/enums'
import type { Role, RegistrationStatus } from '@/generated/prisma/enums'

export type Project = ProjectGetPayload<{}>
export type Area = AreaGetPayload<{}>
export type OngDocument = DocumentGetPayload<{}>
export type TeamMember = TeamMemberGetPayload<{}>
export type Partner = PartnerGetPayload<{}>
export type DocumentCategory = DocumentCategoryGetPayload<{}>
export type GalleryImage = GalleryImageGetPayload<{}>
export type Testimonial = TestimonialGetPayload<{}>
export type SiteSettings = SiteSettingsGetPayload<{}>
export type Volunteer = VolunteerGetPayload<{}>
export type Registration = RegistrationGetPayload<{}>
export type Post = PostGetPayload<{}>
export type Stat = StatGetPayload<{}>
export type AnimalSpecies = AnimalSpeciesGetPayload<{}>
export type AnimalSize = AnimalSizeGetPayload<{}>
export type AnimalAgeRange = AnimalAgeRangeGetPayload<{}>
export type Animal = AnimalGetPayload<{}>
export type PaymentMethod = PaymentMethodGetPayload<{}>
export type FiscalNote = FiscalNoteGetPayload<{}>

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

export type ProjectWithArea = ProjectGetPayload<{
  include: {
    area: true
  }
}>

export type AreaWithProjects = AreaGetPayload<{
  include: {
    projects: true
  }
}>

export type AreaWithMembers = AreaGetPayload<{
  include: {
    projects: true
    members: {
      include: { teamMember: true }
    }
  }
}>

export type DocumentCategoryWithCount = DocumentCategoryGetPayload<{
  include: { _count: { select: { documents: true } } }
}>

export type DocumentWithCategory = DocumentGetPayload<{
  include: {
    category: true
  }
}>

export type ProjectListItem = ProjectGetPayload<{
  select: {
    id: true
    title: true
    slug: true
    description: true
    coverUrl: true
    featured: true
    eventDate: true
    location: true
    vacancies: true
    publishedAt: true
    createdAt: true
    updatedAt: true
    areaId: true
    area: {
      select: {
        id: true
        title: true
        slug: true
      }
    }
  }
}>

export type AreaListItem = AreaGetPayload<{
  select: {
    id: true
    title: true
    slug: true
    description: true
    coverUrl: true
    iconName: true
    publishedAt: true
    createdAt: true
    updatedAt: true
    _count: { select: { projects: true; members: true } }
  }
}>

export type TeamMemberWithAreas = TeamMemberGetPayload<{
  include: { areas: { include: { area: { select: { id: true; title: true } } } } }
}>

export type DocumentListItem = DocumentGetPayload<{
  select: {
    id: true
    title: true
    description: true
    fileUrl: true
    year: true
    publishedAt: true
    createdAt: true
    updatedAt: true
    categoryId: true
    category: {
      select: {
        id: true
        name: true
        slug: true
      }
    }
  }
}>

export type ApiResponse<T> =
  | { data: T; error?: never }
  | { data?: never; error: { message: string } }

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
}

export type VolunteerFilters = {
  search?: string
}

export type PostFilters = {
  search?: string
  page?: number
  limit?: number
}

export type RegistrationWithIncludes = RegistrationGetPayload<{
  include: {
    volunteer: { select: { id: true; name: true; email: true; phone: true } }
    project: { select: { id: true; title: true; slug: true; eventDate: true } }
  }
}>

export type VolunteerWithRegistrations = VolunteerGetPayload<{
  include: {
    registrations: {
      include: { project: { select: { id: true; title: true; slug: true } } }
    }
  }
}>

export type PaginatedResponse<T> = {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
