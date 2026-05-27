import { useMutation, useQuery, useQueryClient, queryOptions } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AreasApi } from '@/lib/api/areas'
import { getErrorMessage } from '@/lib/utils'
import type { Area } from '@/types'

export const areaKeys = {
  all: ['areas'] as const,
  lists: () => [...areaKeys.all, 'list'] as const,
  list: () => [...areaKeys.lists()] as const,
  details: () => [...areaKeys.all, 'detail'] as const,
  detail: (id: string) => [...areaKeys.details(), id] as const,
}

export const areasQueryOptions = () =>
  queryOptions({
    queryKey: areaKeys.list(),
    queryFn: () => AreasApi.findAll(),
  })

export const areaQueryOptions = (id: string | undefined) =>
  queryOptions({
    queryKey: areaKeys.detail(id ?? ''),
    queryFn: () => AreasApi.findById(id!),
    enabled: !!id,
  })

export function useAreas() {
  return useQuery(areasQueryOptions())
}

export function useArea(id: string) {
  return useQuery(areaQueryOptions(id))
}

export function useAreaMutations() {
  const queryClient = useQueryClient()

  const onSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: areaKeys.all })
    toast.success(message)
  }

  const onError = (error: unknown, action: string) => {
    toast.error(`Falha ao ${action}`, { description: getErrorMessage(error) })
  }

  const create = useMutation({
    mutationFn: AreasApi.create,
    onSuccess: () => onSuccess('Área criada com sucesso!'),
    onError: (e) => onError(e, 'criar área'),
  })

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => AreasApi.update(id, data),
    onSuccess: () => onSuccess('Área atualizada!'),
    onError: (e) => onError(e, 'atualizar área'),
  })

  const remove = useMutation({
    mutationFn: AreasApi.delete,
    onSuccess: () => onSuccess('Área removida.'),
    onError: (e) => onError(e, 'remover área'),
  })

  return {
    create,
    update,
    remove,
    isPending: create.isPending || update.isPending || remove.isPending,
  }
}
