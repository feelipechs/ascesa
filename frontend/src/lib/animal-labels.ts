import { AnimalSpecies, AnimalSize, AnimalAgeRange } from '@/generated/prisma/enums'

export const speciesLabels: Record<AnimalSpecies, string> = {
  [AnimalSpecies.DOG]: 'Cachorro',
  [AnimalSpecies.CAT]: 'Gato',
  [AnimalSpecies.BIRD]: 'Pássaro',
  [AnimalSpecies.RABBIT]: 'Coelho',
  [AnimalSpecies.HAMSTER]: 'Hamster',
  [AnimalSpecies.FISH]: 'Peixe',
  [AnimalSpecies.OTHER]: 'Outro',
}

export const sizeLabels: Record<AnimalSize, string> = {
  [AnimalSize.SMALL]: 'Pequeno',
  [AnimalSize.MEDIUM]: 'Médio',
  [AnimalSize.LARGE]: 'Grande',
}

export const ageRangeLabels: Record<AnimalAgeRange, string> = {
  [AnimalAgeRange.PUPPY]: 'Filhote',
  [AnimalAgeRange.ADULT]: 'Adulto',
  [AnimalAgeRange.SENIOR]: 'Idoso',
}

export const speciesOptions = Object.entries(speciesLabels).map(([value, label]) => ({ value, label }))
export const sizeOptions = Object.entries(sizeLabels).map(([value, label]) => ({ value, label }))
export const ageRangeOptions = Object.entries(ageRangeLabels).map(([value, label]) => ({ value, label }))
