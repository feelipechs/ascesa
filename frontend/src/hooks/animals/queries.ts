'use client'

import { useMutation, useQuery, useQueryClient, queryOptions } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AnimalsApi } from '@/lib/api/animals'
import { getErrorMessage } from '@/lib/utils'

export const animalKeys = {
  all: ['animals'] as const,
  lists: () => [...animalKeys.all, 'list'] as const,
  list: (filters?: Record<string, string | undefined>) => [...animalKeys.lists(), filters] as const,
  details: () => [...animalKeys.all, 'detail'] as const,
  detail: (slug: string) => [...animalKeys.details(), slug] as const,
}

export const animalsQueryOptions = (filters?: Record<string, string | undefined>) =>
  queryOptions({
    queryKey: animalKeys.list(filters),
    queryFn: () => AnimalsApi.findAll(filters),
  })

export const animalQueryOptions = (slug: string | undefined) =>
  queryOptions({
    queryKey: animalKeys.detail(slug ?? ''),
    queryFn: () => AnimalsApi.findBySlug(slug!),
    enabled: !!slug,
  })

export function useAnimals(filters?: Record<string, string | undefined>) {
  return useQuery(animalsQueryOptions(filters))
}

export function useAnimalMutations() {
  const queryClient = useQueryClient()

  const onSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: animalKeys.all })
    toast.success(message)
  }

  const onError = (error: unknown, action: string) => {
    toast.error(`Falha ao ${action}`, { description: getErrorMessage(error) })
  }

  const create = useMutation({
    mutationFn: AnimalsApi.create,
    onSuccess: () => onSuccess('Animal criado com sucesso!'),
    onError: (e) => onError(e, 'criar animal'),
  })

  const update = useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: unknown }) => AnimalsApi.update(slug, data),
    onSuccess: () => onSuccess('Animal atualizado!'),
    onError: (e) => onError(e, 'atualizar animal'),
  })

  const remove = useMutation({
    mutationFn: AnimalsApi.delete,
    onSuccess: () => onSuccess('Animal removido.'),
    onError: (e) => onError(e, 'remover animal'),
  })

  return {
    create,
    update,
    remove,
    isPending: create.isPending || update.isPending || remove.isPending,
  }
}
