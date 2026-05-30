'use client'

import { useMutation, useQuery, useQueryClient, queryOptions } from '@tanstack/react-query'
import { toast } from 'sonner'
import { SettingsApi } from '@/lib/api/settings'
import { getErrorMessage } from '@/lib/utils'

export const settingsKeys = {
  all: ['settings'] as const,
  detail: () => [...settingsKeys.all, 'detail'] as const,
}

export const settingsQueryOptions = () =>
  queryOptions({
    queryKey: settingsKeys.detail(),
    queryFn: () => SettingsApi.find(),
  })

export function useSettings() {
  return useQuery(settingsQueryOptions())
}

export function useUpdateSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: unknown) => SettingsApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.all })
      toast.success('Configurações atualizadas!')
    },
    onError: (error) => {
      toast.error('Falha ao atualizar configurações', {
        description: getErrorMessage(error),
      })
    },
  })
}
