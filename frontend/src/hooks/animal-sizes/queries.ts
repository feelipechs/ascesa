'use client'

import { useMutation, useQuery, useQueryClient, queryOptions } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AnimalSizesApi } from '@/lib/api/animal-sizes'
import { getErrorMessage } from '@/lib/utils'

export const animalSizeKeys = {
  all: ['animal-sizes'] as const,
  lists: () => [...animalSizeKeys.all, 'list'] as const,
  list: () => [...animalSizeKeys.lists()] as const,
  details: () => [...animalSizeKeys.all, 'detail'] as const,
  detail: (id: string) => [...animalSizeKeys.details(), id] as const,
}

export const animalSizesQueryOptions = () =>
  queryOptions({
    queryKey: animalSizeKeys.list(),
    queryFn: () => AnimalSizesApi.findAll(),
  })

export const animalSizeByIdQueryOptions = (id: string | undefined) =>
  queryOptions({
    queryKey: animalSizeKeys.detail(id ?? ''),
    queryFn: () => AnimalSizesApi.findById(id!),
    enabled: !!id,
  })

export function useAnimalSizes() {
  return useQuery(animalSizesQueryOptions())
}

export function useAnimalSizeById(id: string) {
  return useQuery(animalSizeByIdQueryOptions(id))
}

export function useAnimalSizeMutations() {
  const queryClient = useQueryClient()

  const onSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: animalSizeKeys.all })
    toast.success(message)
  }

  const onError = (error: unknown, action: string) => {
    toast.error(`Falha ao ${action}`, { description: getErrorMessage(error) })
  }

  const create = useMutation({
    mutationFn: AnimalSizesApi.create,
    onSuccess: () => onSuccess('Porte criado com sucesso!'),
    onError: (e) => onError(e, 'criar porte'),
  })

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => AnimalSizesApi.update(id, data),
    onSuccess: () => onSuccess('Porte atualizado!'),
    onError: (e) => onError(e, 'atualizar porte'),
  })

  const remove = useMutation({
    mutationFn: AnimalSizesApi.delete,
    onSuccess: () => onSuccess('Porte removido.'),
    onError: (e) => onError(e, 'remover porte'),
  })

  return {
    create,
    update,
    remove,
    isPending: create.isPending || update.isPending || remove.isPending,
  }
}
