'use client'

import { useMutation, useQuery, useQueryClient, queryOptions } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AnimalSpeciesApi } from '@/lib/api/animal-species'
import { getErrorMessage } from '@/lib/utils'
import { animalReferencesKeys } from '@/hooks/animal-references/queries'

export const animalSpeciesKeys = {
  all: ['animal-species'] as const,
  lists: () => [...animalSpeciesKeys.all, 'list'] as const,
  list: () => [...animalSpeciesKeys.lists()] as const,
  details: () => [...animalSpeciesKeys.all, 'detail'] as const,
  detail: (id: string) => [...animalSpeciesKeys.details(), id] as const,
}

export const animalSpeciesQueryOptions = () =>
  queryOptions({
    queryKey: animalSpeciesKeys.list(),
    queryFn: () => AnimalSpeciesApi.findAll(),
  })

export const animalSpeciesByIdQueryOptions = (id: string | undefined) =>
  queryOptions({
    queryKey: animalSpeciesKeys.detail(id ?? ''),
    queryFn: () => AnimalSpeciesApi.findById(id!),
    enabled: !!id,
  })

export function useAnimalSpecies() {
  return useQuery(animalSpeciesQueryOptions())
}

export function useAnimalSpeciesMutations() {
  const queryClient = useQueryClient()

  const onSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: animalSpeciesKeys.all })
    queryClient.invalidateQueries({ queryKey: animalReferencesKeys.all })
    toast.success(message)
  }

  const onError = (error: unknown, action: string) => {
    toast.error(`Falha ao ${action}`, { description: getErrorMessage(error) })
  }

  const create = useMutation({
    mutationFn: AnimalSpeciesApi.create,
    onSuccess: () => onSuccess('Espécie criada com sucesso!'),
    onError: (e) => onError(e, 'criar espécie'),
  })

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => AnimalSpeciesApi.update(id, data),
    onSuccess: () => onSuccess('Espécie atualizada!'),
    onError: (e) => onError(e, 'atualizar espécie'),
  })

  const remove = useMutation({
    mutationFn: AnimalSpeciesApi.delete,
    onSuccess: () => onSuccess('Espécie removida.'),
    onError: (e) => onError(e, 'remover espécie'),
  })

  return {
    create,
    update,
    remove,
    isPending: create.isPending || update.isPending || remove.isPending,
  }
}
