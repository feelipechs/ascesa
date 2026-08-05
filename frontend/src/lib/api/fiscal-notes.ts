import type { FiscalNote, PaginatedResponse } from '@/types'

export const FiscalNotesApi = {
  async findAll(filters?: { page?: number; limit?: number }): Promise<PaginatedResponse<FiscalNote>> {
    const params = new URLSearchParams()
    if (filters?.page) params.set('page', String(filters.page))
    if (filters?.limit) params.set('limit', String(filters.limit))
    const query = params.toString()
    const res = await fetch(`/api/fiscal-notes${query ? `?${query}` : ''}`)
    if (!res.ok) throw new Error('Falha ao carregar notas fiscais')
    return res.json()
  },

  async create(data: unknown) {
    const res = await fetch('/api/fiscal-notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Falha ao enviar nota fiscal')
    return res.json()
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/fiscal-notes/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('Falha ao remover nota fiscal')
  },
}
