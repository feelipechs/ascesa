type AnimalListItem = {
  id: string
  name: string
  slug: string
  coverUrl: string | null
  description: string | null
  status: string
  featured: boolean
  shelterSince: string
  species: { id: string; name: string }
  size: { id: string; label: string } | null
  ageRange: { id: string; label: string } | null
  gender: string
  breed: string | null
  birthDate: string | null
  ageRangeId: string | null
  speciesId: string
  sizeId: string | null
  content: string | null
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

type AnimalDetail = AnimalListItem & {
  gallery: Array<{ id: string; url: string; caption: string | null; order: number }>
}

type PaginatedResult = {
  data: AnimalListItem[]
  meta: { total: number; page: number; limit: number; totalPages: number }
}

export const AnimalsApi = {
  async findAll(filters?: Record<string, string | undefined>): Promise<PaginatedResult> {
    const params = new URLSearchParams()
    if (filters?.speciesId) params.set('speciesId', filters.speciesId)
    if (filters?.sizeId) params.set('sizeId', filters.sizeId)
    if (filters?.ageRangeId) params.set('ageRangeId', filters.ageRangeId)
    if (filters?.gender) params.set('gender', filters.gender)
    if (filters?.status) params.set('status', filters.status)
    if (filters?.search) params.set('search', filters.search)
    if (filters?.featured) params.set('featured', 'true')
    if (filters?.page) params.set('page', String(filters.page))
    if (filters?.limit) params.set('limit', String(filters.limit))
    const query = params.toString()
    const res = await fetch(`/api/animals${query ? `?${query}` : ''}`)
    if (!res.ok) throw new Error('Falha ao carregar animais')
    return res.json()
  },

  async findBySlug(slug: string): Promise<AnimalDetail> {
    const res = await fetch(`/api/animals/${slug}`)
    if (!res.ok) throw new Error('Falha ao carregar animal')
    return res.json()
  },

  async create(data: unknown): Promise<Record<string, unknown>> {
    const res = await fetch('/api/animals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Falha ao criar animal')
    return res.json()
  },

  async update(slug: string, data: unknown): Promise<Record<string, unknown>> {
    const res = await fetch(`/api/animals/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Falha ao atualizar animal')
    return res.json()
  },

  async delete(slug: string): Promise<void> {
    const res = await fetch(`/api/animals/${slug}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Falha ao remover animal')
  },
}
