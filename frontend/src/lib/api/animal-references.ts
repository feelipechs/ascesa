import type { AnimalSpecies, AnimalSize, AnimalAgeRange } from '@/types'

export type AnimalReferences = {
  species: AnimalSpecies[]
  sizes: AnimalSize[]
  ageRanges: AnimalAgeRange[]
}

export const AnimalReferencesApi = {
  async findAll(): Promise<AnimalReferences> {
    const res = await fetch('/api/animal-references')
    if (!res.ok) throw new Error('Falha ao carregar referências')
    const json = await res.json()
    return json.data as AnimalReferences
  },
}
