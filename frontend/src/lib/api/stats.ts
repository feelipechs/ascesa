import type { Stat } from '@/types'

export const StatsApi = {
  async findAll(): Promise<Stat[]> {
    const res = await fetch('/api/stats')
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao carregar métricas')
    }
    return res.json()
  },

  async findById(id: string): Promise<Stat> {
    const res = await fetch(`/api/stats/${id}`)
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao carregar métrica')
    }
    return res.json()
  },

  async create(data: unknown): Promise<Stat> {
    const res = await fetch('/api/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao criar métrica')
    }
    return res.json()
  },

  async update(id: string, data: unknown): Promise<Stat> {
    const res = await fetch(`/api/stats/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao atualizar métrica')
    }
    return res.json()
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/stats/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao remover métrica')
    }
  },
}
