'use client'

import { useMutation, useQuery, useQueryClient, queryOptions } from '@tanstack/react-query'
import { toast } from 'sonner'
import { PostsApi } from '@/lib/api/posts'
import { getErrorMessage } from '@/lib/utils'
import type { PostFilters } from '@/types'

export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (filters?: PostFilters) => [...postKeys.lists(), filters] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
}

export const postsQueryOptions = (filters?: PostFilters) =>
  queryOptions({
    queryKey: postKeys.list(filters),
    queryFn: () => PostsApi.findAll(filters),
  })

export const postQueryOptions = (id: string | undefined) =>
  queryOptions({
    queryKey: postKeys.detail(id ?? ''),
    queryFn: () => PostsApi.findById(id!),
    enabled: !!id,
  })

export function usePosts(filters?: PostFilters) {
  return useQuery(postsQueryOptions(filters))
}

export function usePostMutations() {
  const queryClient = useQueryClient()

  const onSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: postKeys.all })
    toast.success(message)
  }

  const onError = (error: unknown, action: string) => {
    toast.error(`Falha ao ${action}`, { description: getErrorMessage(error) })
  }

  const create = useMutation({
    mutationFn: PostsApi.create,
    onSuccess: () => onSuccess('Post criado com sucesso!'),
    onError: (e) => onError(e, 'criar post'),
  })

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => PostsApi.update(id, data),
    onSuccess: () => onSuccess('Post atualizado!'),
    onError: (e) => onError(e, 'atualizar post'),
  })

  const remove = useMutation({
    mutationFn: PostsApi.delete,
    onSuccess: () => onSuccess('Post removido.'),
    onError: (e) => onError(e, 'remover post'),
  })

  return {
    create,
    update,
    remove,
    isPending: create.isPending || update.isPending || remove.isPending,
  }
}
