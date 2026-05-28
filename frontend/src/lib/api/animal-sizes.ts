import type { AnimalSize } from '@/types'

export const AnimalSizesApi = {
  async findAll(): Promise<AnimalSize[]> {
    const res = await fetch('/api/animal-sizes')
    if (!res.ok) throw new Error('Falha ao carregar portes')
    const json = await res.json()
    return json.data
  },

  async findById(id: string): Promise<AnimalSize> {
    const res = await fetch(`/api/animal-sizes/${id}`)
    if (!res.ok) throw new Error('Falha ao carregar porte')
    return res.json()
  },

  async create(data: unknown): Promise<AnimalSize> {
    const res = await fetch('/api/animal-sizes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Falha ao criar porte')
    return res.json()
  },

  async update(id: string, data: unknown): Promise<AnimalSize> {
    const res = await fetch(`/api/animal-sizes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Falha ao atualizar porte')
    return res.json()
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/animal-sizes/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Falha ao remover porte')
  },
}
