import type { Registration, RegistrationWithIncludes, RegistrationFilters, PaginatedResponse } from '@/types'

export const RegistrationsApi = {
  async findAll(filters?: RegistrationFilters): Promise<PaginatedResponse<RegistrationWithIncludes>> {
    const params = new URLSearchParams()
    if (filters?.projectId) params.set('projectId', filters.projectId)
    if (filters?.volunteerId) params.set('volunteerId', filters.volunteerId)
    if (filters?.status) params.set('status', filters.status)
    if (filters?.page) params.set('page', String(filters.page))
    if (filters?.limit) params.set('limit', String(filters.limit))
    const query = params.toString()
    const res = await fetch(`/api/registrations${query ? `?${query}` : ''}`)
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao carregar inscrições')
    }
    return res.json()
  },

  async findById(id: string): Promise<RegistrationWithIncludes> {
    const res = await fetch(`/api/registrations/${id}`)
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao carregar inscrição')
    }
    return res.json()
  },

  async publicRegister(data: unknown): Promise<Registration> {
    const res = await fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao realizar inscrição')
    }
    return res.json()
  },

  async updateStatus(id: string, data: unknown): Promise<Registration> {
    const res = await fetch(`/api/registrations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao atualizar inscrição')
    }
    return res.json()
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/registrations/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao remover inscrição')
    }
  },
}
