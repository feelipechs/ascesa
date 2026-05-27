import type { Partner } from '@/types'

export const PartnersApi = {
  async findAll(): Promise<Partner[]> {
    const res = await fetch('/api/partners')
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao carregar parceiros')
    }
    const json = await res.json()
    return json.data
  },

  async findById(id: string): Promise<Partner> {
    const res = await fetch(`/api/partners/${id}`)
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao carregar parceiro')
    }
    return res.json()
  },

  async create(data: unknown): Promise<Partner> {
    const res = await fetch('/api/partners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao criar parceiro')
    }
    return res.json()
  },

  async update(id: string, data: unknown): Promise<Partner> {
    const res = await fetch(`/api/partners/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao atualizar parceiro')
    }
    return res.json()
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/partners/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao remover parceiro')
    }
  },
}
