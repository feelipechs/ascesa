'use client'

import { useMutation, useQuery, useQueryClient, queryOptions } from '@tanstack/react-query'
import { toast } from 'sonner'
import { FiscalNotesApi } from '@/lib/api/fiscal-notes'
import { getErrorMessage } from '@/lib/utils'

export const fiscalNoteKeys = {
  all: ['fiscal-notes'] as const,
  lists: () => [...fiscalNoteKeys.all, 'list'] as const,
  list: (filters?: { page?: number; limit?: number }) => [...fiscalNoteKeys.lists(), filters] as const,
}

export const fiscalNotesQueryOptions = (filters?: { page?: number; limit?: number }) =>
  queryOptions({
    queryKey: fiscalNoteKeys.list(filters),
    queryFn: () => FiscalNotesApi.findAll(filters),
  })

export function useFiscalNotes(filters?: { page?: number; limit?: number }) {
  return useQuery(fiscalNotesQueryOptions(filters))
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
    onSuccess: () => onSuccess('Nota fiscal enviada com sucesso!'),
    onError: (e) => onError(e, 'enviar nota fiscal'),
  })

  const remove = useMutation({
    mutationFn: FiscalNotesApi.delete,
    onSuccess: () => onSuccess('Nota fiscal removida.'),
    onError: (e) => onError(e, 'remover nota fiscal'),
  })

  return {
    create,
    remove,
    isPending: create.isPending || remove.isPending,
  }
}
