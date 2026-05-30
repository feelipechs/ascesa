import type { AnimalAgeRange } from '@/types'

export const AnimalAgeRangesApi = {
  async findAll(): Promise<AnimalAgeRange[]> {
    const res = await fetch('/api/animal-age-ranges')
    if (!res.ok) throw new Error('Falha ao carregar faixas etárias')
    const json = await res.json()
    return json.data
  },

  async findById(id: string): Promise<AnimalAgeRange> {
    const res = await fetch(`/api/animal-age-ranges/${id}`)
    if (!res.ok) throw new Error('Falha ao carregar faixa etária')
    return res.json()
  },

  async create(data: unknown): Promise<AnimalAgeRange> {
    const res = await fetch('/api/animal-age-ranges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Falha ao criar faixa etária')
    return res.json()
  },

  async update(id: string, data: unknown): Promise<AnimalAgeRange> {
    const res = await fetch(`/api/animal-age-ranges/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Falha ao atualizar faixa etária')
    return res.json()
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/animal-age-ranges/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Falha ao remover faixa etária')
  },

  async reorder(items: { id: string; order: number }[]): Promise<void> {
    const res = await fetch('/api/animal-age-ranges/reorder', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.error || 'Falha ao reordenar faixas etárias')
    }
  },
}
