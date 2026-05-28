import type { AnimalSpecies } from '@/types'

export const AnimalSpeciesApi = {
  async findAll(): Promise<AnimalSpecies[]> {
    const res = await fetch('/api/animal-species')
    if (!res.ok) throw new Error('Falha ao carregar espécies')
    const json = await res.json()
    return json.data
  },

  async findById(id: string): Promise<AnimalSpecies> {
    const res = await fetch(`/api/animal-species/${id}`)
    if (!res.ok) throw new Error('Falha ao carregar espécie')
    return res.json()
  },

  async create(data: unknown): Promise<AnimalSpecies> {
    const res = await fetch('/api/animal-species', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Falha ao criar espécie')
    return res.json()
  },

  async update(id: string, data: unknown): Promise<AnimalSpecies> {
    const res = await fetch(`/api/animal-species/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Falha ao atualizar espécie')
    return res.json()
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/animal-species/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Falha ao remover espécie')
  },
}
