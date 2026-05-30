'use client'

import { useMutation, useQuery, useQueryClient, queryOptions } from '@tanstack/react-query'
import { toast } from 'sonner'
import { FiscalNotesApi } from '@/lib/api/fiscal-notes'
import { getErrorMessage } from '@/lib/utils'

export const fiscalNoteKeys = {
  all: ['fiscal-notes'] as const,
  lists: () => [...fiscalNoteKeys.all, 'list'] as const,
  list: () => [...fiscalNoteKeys.lists()] as const,
  details: () => [...fiscalNoteKeys.all, 'detail'] as const,
  detail: (id: string) => [...fiscalNoteKeys.details(), id] as const,
}

export const fiscalNotesQueryOptions = () =>
  queryOptions({
    queryKey: fiscalNoteKeys.list(),
    queryFn: () => FiscalNotesApi.findAll(),
  })

export const fiscalNoteQueryOptions = (id: string | undefined) =>
  queryOptions({
    queryKey: fiscalNoteKeys.detail(id ?? ''),
    queryFn: () => FiscalNotesApi.findById(id!),
    enabled: !!id,
  })

export function useFiscalNotes() {
  return useQuery(fiscalNotesQueryOptions())
}

export function useFiscalNoteMutations() {
  const queryClient = useQueryClient()

  const onSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: fiscalNoteKeys.all })
    toast.success(message)
  }

  const onError = (error: unknown, action: string) => {
    toast.error(`Falha ao ${action}`, { description: getErrorMessage(error) })
  }

  const create = useMutation({
    mutationFn: FiscalNotesApi.create,
    onSuccess: () => onSuccess('Nota fiscal criada com sucesso!'),
    onError: (e) => onError(e, 'criar nota fiscal'),
  })

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => FiscalNotesApi.update(id, data),
    onSuccess: () => onSuccess('Nota fiscal atualizada!'),
    onError: (e) => onError(e, 'atualizar nota fiscal'),
  })

  const remove = useMutation({
    mutationFn: FiscalNotesApi.delete,
    onSuccess: () => onSuccess('Nota fiscal removida.'),
    onError: (e) => onError(e, 'remover nota fiscal'),
  })

  return { create, update, remove, isPending: create.isPending || update.isPending || remove.isPending }
}
