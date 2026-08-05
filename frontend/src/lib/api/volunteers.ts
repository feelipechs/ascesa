import type { Volunteer, VolunteerFilters, VolunteerWithRegistrations, PaginatedResponse } from '@/types'

export const VolunteersApi = {
  async findAll(filters?: VolunteerFilters): Promise<PaginatedResponse<Volunteer>> {
    const params = new URLSearchParams()
    if (filters?.search) params.set('search', filters.search)
    if (filters?.page) params.set('page', String(filters.page))
    if (filters?.limit) params.set('limit', String(filters.limit))
    const query = params.toString()
    const res = await fetch(`/api/volunteers${query ? `?${query}` : ''}`)
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao carregar voluntários')
    }
    return res.json()
  },

  async findById(id: string): Promise<VolunteerWithRegistrations> {
    const res = await fetch(`/api/volunteers/${id}`)
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao carregar voluntário')
    }
    return res.json()
  },

  async create(data: unknown): Promise<Volunteer> {
    const res = await fetch('/api/volunteers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao criar voluntário')
    }
    return res.json()
  },

  async update(id: string, data: unknown): Promise<Volunteer> {
    const res = await fetch(`/api/volunteers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao atualizar voluntário')
    }
    return res.json()
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/volunteers/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao remover voluntário')
    }
  },
}
