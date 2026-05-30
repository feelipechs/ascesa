'use client'

import { useMutation, useQuery, useQueryClient, queryOptions } from '@tanstack/react-query'
import { toast } from 'sonner'
import { UsersApi } from '@/lib/api/users'
import { getErrorMessage } from '@/lib/utils'

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: () => [...userKeys.lists()] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
}

export const usersQueryOptions = () =>
  queryOptions({
    queryKey: userKeys.list(),
    queryFn: () => UsersApi.findAll(),
  })

export const userQueryOptions = (id: string | undefined) =>
  queryOptions({
    queryKey: userKeys.detail(id ?? ''),
    queryFn: () => UsersApi.findById(id!),
    enabled: !!id,
  })

export function useUsers() {
  return useQuery(usersQueryOptions())
}

export function useUserMutations() {
  const queryClient = useQueryClient()

  const onSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: userKeys.all })
    toast.success(message)
  }

  const onError = (error: unknown, action: string) => {
    toast.error(`Falha ao ${action}`, { description: getErrorMessage(error) })
  }

  const create = useMutation({
    mutationFn: UsersApi.create,
    onSuccess: () => onSuccess('Usuário criado com sucesso!'),
    onError: (e) => onError(e, 'criar usuário'),
  })

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => UsersApi.update(id, data),
    onSuccess: () => onSuccess('Usuário atualizado!'),
    onError: (e) => onError(e, 'atualizar usuário'),
  })

  const remove = useMutation({
    mutationFn: UsersApi.delete,
    onSuccess: () => onSuccess('Usuário removido.'),
    onError: (e) => onError(e, 'remover usuário'),
  })

  return {
    create,
    update,
    remove,
    isPending: create.isPending || update.isPending || remove.isPending,
  }
}

export function useUpdateUserPassword() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { currentPassword: string; newPassword: string } }) =>
      UsersApi.updatePassword(id, data),
    onSuccess: () => {
      toast.success('Senha alterada com sucesso!')
    },
    onError: (error) => {
      toast.error('Falha ao alterar senha', {
        description: getErrorMessage(error),
      })
    },
  })
}
