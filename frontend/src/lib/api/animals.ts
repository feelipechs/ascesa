import type { AnimalListItem, AnimalWithDetails, AnimalFilters, PaginatedResponse } from '@/types'

export const AnimalsApi = {
  async findAll(filters?: AnimalFilters): Promise<PaginatedResponse<AnimalListItem>> {
    const params = new URLSearchParams()
    if (filters?.species) params.set('species', filters.species)
    if (filters?.size) params.set('size', filters.size)
    if (filters?.ageRange) params.set('ageRange', filters.ageRange)
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

  async findBySlug(slug: string): Promise<AnimalWithDetails> {
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
