import { useMutation, useQuery, useQueryClient, queryOptions } from '@tanstack/react-query'
import { toast } from 'sonner'
import { VolunteersApi } from '@/lib/api/volunteers'
import { getErrorMessage } from '@/lib/utils'
import type { VolunteerFilters } from '@/types'

export const volunteerKeys = {
  all: ['volunteers'] as const,
  lists: () => [...volunteerKeys.all, 'list'] as const,
  list: (filters?: VolunteerFilters) => [...volunteerKeys.lists(), filters] as const,
  details: () => [...volunteerKeys.all, 'detail'] as const,
  detail: (id: string) => [...volunteerKeys.details(), id] as const,
}

export const volunteersQueryOptions = (filters?: VolunteerFilters) =>
  queryOptions({
    queryKey: volunteerKeys.list(filters),
    queryFn: () => VolunteersApi.findAll(filters),
  })

export const volunteerQueryOptions = (id: string | undefined) =>
  queryOptions({
    queryKey: volunteerKeys.detail(id ?? ''),
    queryFn: () => VolunteersApi.findById(id!),
    enabled: !!id,
  })

export function useVolunteers(filters?: VolunteerFilters) {
  return useQuery(volunteersQueryOptions(filters))
}

export function useVolunteer(id: string) {
  return useQuery(volunteerQueryOptions(id))
}

export function useVolunteerMutations() {
  const queryClient = useQueryClient()

  const onSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: volunteerKeys.all })
    toast.success(message)
  }

  const onError = (error: unknown, action: string) => {
    toast.error(`Falha ao ${action}`, { description: getErrorMessage(error) })
  }

  const create = useMutation({
    mutationFn: VolunteersApi.create,
    onSuccess: () => onSuccess('Voluntário criado com sucesso!'),
    onError: (e) => onError(e, 'criar voluntário'),
  })

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => VolunteersApi.update(id, data),
    onSuccess: () => onSuccess('Voluntário atualizado!'),
    onError: (e) => onError(e, 'atualizar voluntário'),
  })

  const remove = useMutation({
    mutationFn: VolunteersApi.delete,
    onSuccess: () => onSuccess('Voluntário removido.'),
    onError: (e) => onError(e, 'remover voluntário'),
  })

  return {
    create,
    update,
    remove,
    isPending: create.isPending || update.isPending || remove.isPending,
  }
}
