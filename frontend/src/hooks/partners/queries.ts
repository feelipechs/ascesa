'use client'

import { useMutation, useQuery, useQueryClient, queryOptions } from '@tanstack/react-query'
import { toast } from 'sonner'
import { PartnersApi } from '@/lib/api/partners'
import { getErrorMessage } from '@/lib/utils'

export const partnerKeys = {
  all: ['partners'] as const,
  lists: () => [...partnerKeys.all, 'list'] as const,
  list: () => [...partnerKeys.lists()] as const,
  details: () => [...partnerKeys.all, 'detail'] as const,
  detail: (id: string) => [...partnerKeys.details(), id] as const,
}

export const partnersQueryOptions = () =>
  queryOptions({
    queryKey: partnerKeys.list(),
    queryFn: () => PartnersApi.findAll(),
  })

export const partnerQueryOptions = (id: string | undefined) =>
  queryOptions({
    queryKey: partnerKeys.detail(id ?? ''),
    queryFn: () => PartnersApi.findById(id!),
    enabled: !!id,
  })

export function usePartners() {
  return useQuery(partnersQueryOptions())
}

export function usePartnerMutations() {
  const queryClient = useQueryClient()

  const onSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: partnerKeys.all })
    toast.success(message)
  }

  const onError = (error: unknown, action: string) => {
    toast.error(`Falha ao ${action}`, { description: getErrorMessage(error) })
  }

  const create = useMutation({
    mutationFn: PartnersApi.create,
    onSuccess: () => onSuccess('Parceiro criado com sucesso!'),
    onError: (e) => onError(e, 'criar parceiro'),
  })

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => PartnersApi.update(id, data),
    onSuccess: () => onSuccess('Parceiro atualizado!'),
    onError: (e) => onError(e, 'atualizar parceiro'),
  })

  const remove = useMutation({
    mutationFn: PartnersApi.delete,
    onSuccess: () => onSuccess('Parceiro removido.'),
    onError: (e) => onError(e, 'remover parceiro'),
  })

  return {
    create,
    update,
    remove,
    isPending: create.isPending || update.isPending || remove.isPending,
  }
}
