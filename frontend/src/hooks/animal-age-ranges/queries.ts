'use client'

import { useMutation, useQuery, useQueryClient, queryOptions } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AnimalAgeRangesApi } from '@/lib/api/animal-age-ranges'
import { getErrorMessage } from '@/lib/utils'
import { animalReferencesKeys } from '@/hooks/animal-references/queries'

export const animalAgeRangeKeys = {
  all: ['animal-age-ranges'] as const,
  lists: () => [...animalAgeRangeKeys.all, 'list'] as const,
  list: () => [...animalAgeRangeKeys.lists()] as const,
  details: () => [...animalAgeRangeKeys.all, 'detail'] as const,
  detail: (id: string) => [...animalAgeRangeKeys.details(), id] as const,
}

export const animalAgeRangesQueryOptions = () =>
  queryOptions({
    queryKey: animalAgeRangeKeys.list(),
    queryFn: () => AnimalAgeRangesApi.findAll(),
  })

export const animalAgeRangeByIdQueryOptions = (id: string | undefined) =>
  queryOptions({
    queryKey: animalAgeRangeKeys.detail(id ?? ''),
    queryFn: () => AnimalAgeRangesApi.findById(id!),
    enabled: !!id,
  })

export function useAnimalAgeRanges() {
  return useQuery(animalAgeRangesQueryOptions())
}

export function useAnimalAgeRangeMutations() {
  const queryClient = useQueryClient()

  const onSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: animalAgeRangeKeys.all })
    queryClient.invalidateQueries({ queryKey: animalReferencesKeys.all })
    toast.success(message)
  }

  const onError = (error: unknown, action: string) => {
    toast.error(`Falha ao ${action}`, { description: getErrorMessage(error) })
  }

  const create = useMutation({
    mutationFn: AnimalAgeRangesApi.create,
    onSuccess: () => onSuccess('Faixa etária criada com sucesso!'),
    onError: (e) => onError(e, 'criar faixa etária'),
  })

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => AnimalAgeRangesApi.update(id, data),
    onSuccess: () => onSuccess('Faixa etária atualizada!'),
    onError: (e) => onError(e, 'atualizar faixa etária'),
  })

  const remove = useMutation({
    mutationFn: AnimalAgeRangesApi.delete,
    onSuccess: () => onSuccess('Faixa etária removida.'),
    onError: (e) => onError(e, 'remover faixa etária'),
  })

  return {
    create,
    update,
    remove,
    isPending: create.isPending || update.isPending || remove.isPending,
  }
}
