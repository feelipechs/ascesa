import { useMutation, useQuery, useQueryClient, queryOptions } from '@tanstack/react-query'
import { toast } from 'sonner'
import { DocumentCategoriesApi } from '@/lib/api/document-categories'
import { getErrorMessage } from '@/lib/utils'

export const documentCategoryKeys = {
  all: ['document-categories'] as const,
  lists: () => [...documentCategoryKeys.all, 'list'] as const,
  list: () => [...documentCategoryKeys.lists()] as const,
  details: () => [...documentCategoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...documentCategoryKeys.details(), id] as const,
}

export const documentCategoriesQueryOptions = () =>
  queryOptions({
    queryKey: documentCategoryKeys.list(),
    queryFn: () => DocumentCategoriesApi.findAll(),
  })

export const documentCategoryQueryOptions = (id: string | undefined) =>
  queryOptions({
    queryKey: documentCategoryKeys.detail(id ?? ''),
    queryFn: () => DocumentCategoriesApi.findById(id!),
    enabled: !!id,
  })

export function useDocumentCategories() {
  return useQuery(documentCategoriesQueryOptions())
}

export function useDocumentCategory(id: string) {
  return useQuery(documentCategoryQueryOptions(id))
}

export function useDocumentCategoryMutations() {
  const queryClient = useQueryClient()

  const onSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: documentCategoryKeys.all })
    toast.success(message)
  }

  const onError = (error: unknown, action: string) => {
    toast.error(`Falha ao ${action}`, { description: getErrorMessage(error) })
  }

  const create = useMutation({
    mutationFn: DocumentCategoriesApi.create,
    onSuccess: () => onSuccess('Categoria criada com sucesso!'),
    onError: (e) => onError(e, 'criar categoria'),
  })

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => DocumentCategoriesApi.update(id, data),
    onSuccess: () => onSuccess('Categoria atualizada!'),
    onError: (e) => onError(e, 'atualizar categoria'),
  })

  const remove = useMutation({
    mutationFn: DocumentCategoriesApi.delete,
    onSuccess: () => onSuccess('Categoria removida.'),
    onError: (e) => onError(e, 'remover categoria'),
  })

  return {
    create,
    update,
    remove,
    isPending: create.isPending || update.isPending || remove.isPending,
  }
}
