'use client'

import { useMutation, useQueryClient, queryOptions } from '@tanstack/react-query'
import { toast } from 'sonner'
import { MeApi } from '@/lib/api/me'
import { getErrorMessage } from '@/lib/utils'
import type { UpdateMeInput } from '@/schemas/me.schema'

export const meKeys = {
  all: ['me'] as const,
}

export const meQueryOptions = () =>
  queryOptions({
    queryKey: meKeys.all,
    queryFn: () => MeApi.getProfile(),
  })

export function useMeMutations() {
  const queryClient = useQueryClient()

  const update = useMutation({
    mutationFn: (data: UpdateMeInput) => MeApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: meKeys.all })
      toast.success('Perfil atualizado!')
    },
    onError: (error) => {
      toast.error('Falha ao atualizar perfil', { description: getErrorMessage(error) })
    },
  })

  return { update, isPending: update.isPending }
}
