import { useMutation, useQuery, useQueryClient, queryOptions, keepPreviousData } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ProjectsApi } from '@/lib/api/projects'
import { getErrorMessage } from '@/lib/utils'
import type { ProjectFilters, ProjectWithArea } from '@/types'

export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (filters?: ProjectFilters) => [...projectKeys.lists(), filters] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
}

export const projectsQueryOptions = (filters?: ProjectFilters) =>
  queryOptions({
    queryKey: projectKeys.list(filters),
    queryFn: () => ProjectsApi.findAll(filters),
    placeholderData: keepPreviousData,
  })

export const projectQueryOptions = (id: string | undefined) =>
  queryOptions({
    queryKey: projectKeys.detail(id ?? ''),
    queryFn: () => ProjectsApi.findById(id!),
    enabled: !!id,
  })

export function useProjects(filters?: ProjectFilters) {
  return useQuery(projectsQueryOptions(filters))
}

export function useProject(id: string) {
  return useQuery(projectQueryOptions(id))
}

export function useProjectMutations() {
  const queryClient = useQueryClient()

  const onSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: projectKeys.all })
    toast.success(message)
  }

  const onError = (error: unknown, action: string) => {
    toast.error(`Falha ao ${action}`, {
      description: getErrorMessage(error),
    })
  }

  const create = useMutation({
    mutationFn: ProjectsApi.create,
    onSuccess: () => onSuccess('Projeto criado com sucesso!'),
    onError: (e) => onError(e, 'criar projeto'),
  })

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => ProjectsApi.update(id, data),
    onSuccess: () => onSuccess('Projeto atualizado!'),
    onError: (e) => onError(e, 'atualizar projeto'),
  })

  const remove = useMutation({
    mutationFn: ProjectsApi.delete,
    onSuccess: () => onSuccess('Projeto removido.'),
    onError: (e) => onError(e, 'remover projeto'),
  })

  return {
    create,
    update,
    remove,
    isPending: create.isPending || update.isPending || remove.isPending,
  }
}
