import { useMutation, useQuery, useQueryClient, queryOptions } from '@tanstack/react-query'
import { toast } from 'sonner'
import { RegistrationsApi } from '@/lib/api/registrations'
import { getErrorMessage } from '@/lib/utils'
import type { RegistrationFilters } from '@/types'

export const registrationKeys = {
  all: ['registrations'] as const,
  lists: () => [...registrationKeys.all, 'list'] as const,
  list: (filters?: RegistrationFilters) => [...registrationKeys.lists(), filters] as const,
  details: () => [...registrationKeys.all, 'detail'] as const,
  detail: (id: string) => [...registrationKeys.details(), id] as const,
}

export const registrationsQueryOptions = (filters?: RegistrationFilters) =>
  queryOptions({
    queryKey: registrationKeys.list(filters),
    queryFn: () => RegistrationsApi.findAll(filters),
  })

export const registrationQueryOptions = (id: string | undefined) =>
  queryOptions({
    queryKey: registrationKeys.detail(id ?? ''),
    queryFn: () => RegistrationsApi.findById(id!),
    enabled: !!id,
  })

export function useRegistrations(filters?: RegistrationFilters) {
  return useQuery(registrationsQueryOptions(filters))
}

export function useRegistration(id: string) {
  return useQuery(registrationQueryOptions(id))
}

export function useRegistrationMutations() {
  const queryClient = useQueryClient()

  const onSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: registrationKeys.all })
    toast.success(message)
  }

  const onError = (error: unknown, action: string) => {
    toast.error(`Falha ao ${action}`, { description: getErrorMessage(error) })
  }

  const updateStatus = useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => RegistrationsApi.updateStatus(id, data),
    onSuccess: () => onSuccess('Inscrição atualizada!'),
    onError: (e) => onError(e, 'atualizar inscrição'),
  })

  const remove = useMutation({
    mutationFn: RegistrationsApi.delete,
    onSuccess: () => onSuccess('Inscrição removida.'),
    onError: (e) => onError(e, 'remover inscrição'),
  })

  return {
    updateStatus,
    remove,
    isPending: updateStatus.isPending || remove.isPending,
  }
}
