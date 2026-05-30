'use client'

import { useQuery, queryOptions } from '@tanstack/react-query'
import { AnimalReferencesApi } from '@/lib/api/animal-references'

export const animalReferencesKeys = {
  all: ['animal-references'] as const,
}

export const animalReferencesQueryOptions = () =>
  queryOptions({
    queryKey: animalReferencesKeys.all,
    queryFn: () => AnimalReferencesApi.findAll(),
    staleTime: Infinity,
    gcTime: Infinity,
  })

export function useAnimalReferences() {
  return useQuery(animalReferencesQueryOptions())
}
