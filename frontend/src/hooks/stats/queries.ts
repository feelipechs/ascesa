'use client'

import { useMutation, useQuery, useQueryClient, queryOptions } from '@tanstack/react-query'
import { toast } from 'sonner'
import { StatsApi } from '@/lib/api/stats'
import { getErrorMessage } from '@/lib/utils'
import type { Stat } from '@/types'

export const statKeys = {
  all: ['stats'] as const,
  lists: () => [...statKeys.all, 'list'] as const,
  list: () => [...statKeys.lists()] as const,
  details: () => [...statKeys.all, 'detail'] as const,
  detail: (id: string) => [...statKeys.details(), id] as const,
}

export const statsQueryOptions = () =>
  queryOptions({
    queryKey: statKeys.list(),
    queryFn: () => StatsApi.findAll(),
  })

export const statQueryOptions = (id: string | undefined) =>
  queryOptions({
    queryKey: statKeys.detail(id ?? ''),
    queryFn: () => StatsApi.findById(id!),
    enabled: !!id,
  })

export function useStats() {
  return useQuery(statsQueryOptions())
}

export function useStatMutations() {
  const queryClient = useQueryClient()

  const onSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: statKeys.all })
    toast.success(message)
  }

  const onError = (error: unknown, action: string) => {
    toast.error(`Falha ao ${action}`, { description: getErrorMessage(error) })
  }

  const create = useMutation({
    mutationFn: StatsApi.create,
    onSuccess: (data) => {
      queryClient.setQueryData<Stat[]>(statKeys.list(), (old) =>
        old ? [...old, data] : [data]
      )
      queryClient.invalidateQueries({ queryKey: statKeys.all })
      toast.success('Métrica criada com sucesso!')
    },
    onError: (e) => onError(e, 'criar métrica'),
  })

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => StatsApi.update(id, data),
    onSuccess: (data) => {
      queryClient.setQueryData<Stat[]>(statKeys.list(), (old) =>
        old ? old.map((s) => (s.id === data.id ? data : s)) : old
      )
      queryClient.invalidateQueries({ queryKey: statKeys.all })
      toast.success('Métrica atualizada!')
    },
    onError: (e) => onError(e, 'atualizar métrica'),
  })

  const remove = useMutation({
    mutationFn: StatsApi.delete,
    onSuccess: () => onSuccess('Métrica removida.'),
    onError: (e) => onError(e, 'remover métrica'),
  })

  const reorder = useMutation({
    mutationFn: StatsApi.reorder,
    onSuccess: () => onSuccess('Métricas reordenadas!'),
    onError: (e) => onError(e, 'reordenar métricas'),
  })

  return {
    create,
    update,
    remove,
    reorder,
    isPending: create.isPending || update.isPending || remove.isPending || reorder.isPending,
  }
}
