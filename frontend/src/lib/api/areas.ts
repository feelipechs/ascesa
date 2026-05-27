import type { Area, AreaListItem } from '@/types'

export const AreasApi = {
  async findAll(): Promise<AreaListItem[]> {
    const res = await fetch('/api/areas')
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao carregar áreas')
    }
    const json = await res.json()
    return json.data
  },

  async findById(id: string): Promise<Area> {
    const res = await fetch(`/api/areas/${id}`)
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao carregar área')
    }
    return res.json()
  },

  async create(data: unknown): Promise<Area> {
    const res = await fetch('/api/areas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao criar área')
    }
    return res.json()
  },

  async update(id: string, data: unknown): Promise<Area> {
    const res = await fetch(`/api/areas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao atualizar área')
    }
    return res.json()
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/areas/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao remover área')
    }
  },
}
