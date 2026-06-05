'use client'

import { useMutation, useQuery, useQueryClient, queryOptions } from '@tanstack/react-query'
import { toast } from 'sonner'
import { DocumentsApi } from '@/lib/api/documents'
import { getErrorMessage } from '@/lib/utils'
import { documentCategoryKeys } from '@/hooks/document-categories/queries'
import type { DocumentFilters, DocumentWithCategory } from '@/types'

export const documentKeys = {
  all: ['documents'] as const,
  lists: () => [...documentKeys.all, 'list'] as const,
  list: (filters?: DocumentFilters) => [...documentKeys.lists(), filters] as const,
  details: () => [...documentKeys.all, 'detail'] as const,
  detail: (id: string) => [...documentKeys.details(), id] as const,
}

export const documentsQueryOptions = (filters?: DocumentFilters) =>
  queryOptions({
    queryKey: documentKeys.list(filters),
    queryFn: () => DocumentsApi.findAll(filters),
  })

export const documentQueryOptions = (id: string | undefined) =>
  queryOptions({
    queryKey: documentKeys.detail(id ?? ''),
    queryFn: () => DocumentsApi.findById(id!),
    enabled: !!id,
  })

export function useDocuments(filters?: DocumentFilters) {
  return useQuery(documentsQueryOptions(filters))
}

export function useDocumentMutations() {
  const queryClient = useQueryClient()

  const onSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: documentKeys.all })
    queryClient.invalidateQueries({ queryKey: documentCategoryKeys.all })
    toast.success(message)
  }

  const onError = (error: unknown, action: string) => {
    toast.error(`Falha ao ${action}`, {
      description: getErrorMessage(error),
    })
  }

  const create = useMutation({
    mutationFn: DocumentsApi.create,
    onSuccess: () => onSuccess('Documento criado com sucesso!'),
    onError: (e) => onError(e, 'criar documento'),
  })

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      DocumentsApi.update(id, data),
    onSuccess: () => onSuccess('Documento atualizado!'),
    onError: (e) => onError(e, 'atualizar documento'),
  })

  const remove = useMutation({
    mutationFn: DocumentsApi.delete,
    onSuccess: () => onSuccess('Documento removido.'),
    onError: (e) => onError(e, 'remover documento'),
  })

  return {
    create,
    update,
    remove,
    isPending: create.isPending || update.isPending || remove.isPending,
  }
}