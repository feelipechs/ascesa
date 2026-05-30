import type { DocumentWithCategory, DocumentFilters, PaginatedResponse } from '@/types'

export const DocumentsApi = {
  async findAll(filters?: DocumentFilters): Promise<PaginatedResponse<DocumentWithCategory>> {
    const params = new URLSearchParams()
    if (filters?.search) params.set('search', filters.search)
    if (filters?.categoryId) params.set('categoryId', filters.categoryId)
    if (filters?.year) params.set('year', String(filters.year))
    if (filters?.page) params.set('page', String(filters.page))
    if (filters?.limit) params.set('limit', String(filters.limit))

    const res = await fetch(`/api/documents${params.toString() ? `?${params.toString()}` : ''}`)
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao carregar lista de documentos')
    }
    return res.json()
  },

  async findById(id: string): Promise<DocumentWithCategory> {
    const res = await fetch(`/api/documents/${id}`)
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao carregar detalhes do documento')
    }
    return res.json()
  },

  async create(data: unknown): Promise<DocumentWithCategory> {
    const res = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao criar documento')
    }
    return res.json()
  },

  async update(id: string, data: unknown): Promise<DocumentWithCategory> {
    const res = await fetch(`/api/documents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao atualizar documento')
    }
    return res.json()
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao remover documento')
    }
  },
}