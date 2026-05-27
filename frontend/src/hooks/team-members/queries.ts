import { useMutation, useQuery, useQueryClient, queryOptions } from '@tanstack/react-query'
import { toast } from 'sonner'
import { TeamMembersApi } from '@/lib/api/team-members'
import { getErrorMessage } from '@/lib/utils'
import { areaKeys } from '@/hooks/areas/queries'

export const teamMemberKeys = {
  all: ['team-members'] as const,
  lists: () => [...teamMemberKeys.all, 'list'] as const,
  list: () => [...teamMemberKeys.lists()] as const,
  details: () => [...teamMemberKeys.all, 'detail'] as const,
  detail: (id: string) => [...teamMemberKeys.details(), id] as const,
}

export const teamMembersQueryOptions = () =>
  queryOptions({
    queryKey: teamMemberKeys.list(),
    queryFn: () => TeamMembersApi.findAll(),
  })

export const teamMemberQueryOptions = (id: string | undefined) =>
  queryOptions({
    queryKey: teamMemberKeys.detail(id ?? ''),
    queryFn: () => TeamMembersApi.findById(id!),
    enabled: !!id,
  })

export function useTeamMembers() {
  return useQuery(teamMembersQueryOptions())
}

export function useTeamMember(id: string) {
  return useQuery(teamMemberQueryOptions(id))
}

export function useTeamMemberMutations() {
  const queryClient = useQueryClient()

  const onSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: teamMemberKeys.all })
    queryClient.invalidateQueries({ queryKey: areaKeys.all })
    toast.success(message)
  }

  const onError = (error: unknown, action: string) => {
    toast.error(`Falha ao ${action}`, { description: getErrorMessage(error) })
  }

  const create = useMutation({
    mutationFn: TeamMembersApi.create,
    onSuccess: () => onSuccess('Membro criado com sucesso!'),
    onError: (e) => onError(e, 'criar membro'),
  })

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => TeamMembersApi.update(id, data),
    onSuccess: () => onSuccess('Membro atualizado!'),
    onError: (e) => onError(e, 'atualizar membro'),
  })

  const remove = useMutation({
    mutationFn: TeamMembersApi.delete,
    onSuccess: () => onSuccess('Membro removido.'),
    onError: (e) => onError(e, 'remover membro'),
  })

  return {
    create,
    update,
    remove,
    isPending: create.isPending || update.isPending || remove.isPending,
  }
}
