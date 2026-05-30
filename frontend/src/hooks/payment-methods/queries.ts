'use client'

import { useMutation, useQuery, useQueryClient, queryOptions } from '@tanstack/react-query'
import { toast } from 'sonner'
import { PaymentMethodsApi } from '@/lib/api/payment-methods'
import { getErrorMessage } from '@/lib/utils'

export const paymentMethodKeys = {
  all: ['payment-methods'] as const,
  lists: () => [...paymentMethodKeys.all, 'list'] as const,
  list: (activeOnly?: boolean) => [...paymentMethodKeys.lists(), { activeOnly }] as const,
  details: () => [...paymentMethodKeys.all, 'detail'] as const,
  detail: (id: string) => [...paymentMethodKeys.details(), id] as const,
}

export const paymentMethodsQueryOptions = (activeOnly?: boolean) =>
  queryOptions({
    queryKey: paymentMethodKeys.list(activeOnly),
    queryFn: () => PaymentMethodsApi.findAll(activeOnly),
  })

export const paymentMethodQueryOptions = (id: string | undefined) =>
  queryOptions({
    queryKey: paymentMethodKeys.detail(id ?? ''),
    queryFn: () => PaymentMethodsApi.findById(id!),
    enabled: !!id,
  })

export function usePaymentMethods(activeOnly?: boolean) {
  return useQuery(paymentMethodsQueryOptions(activeOnly))
}

export function usePaymentMethodMutations() {
  const queryClient = useQueryClient()

  const onSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: paymentMethodKeys.all })
    toast.success(message)
  }

  const onError = (error: unknown, action: string) => {
    toast.error(`Falha ao ${action}`, { description: getErrorMessage(error) })
  }

  const create = useMutation({
    mutationFn: PaymentMethodsApi.create,
    onSuccess: () => onSuccess('Método de pagamento criado com sucesso!'),
    onError: (e) => onError(e, 'criar método de pagamento'),
  })

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => PaymentMethodsApi.update(id, data),
    onSuccess: () => onSuccess('Método de pagamento atualizado!'),
    onError: (e) => onError(e, 'atualizar método de pagamento'),
  })

  const remove = useMutation({
    mutationFn: PaymentMethodsApi.delete,
    onSuccess: () => onSuccess('Método de pagamento removido.'),
    onError: (e) => onError(e, 'remover método de pagamento'),
  })

  return { create, update, remove, isPending: create.isPending || update.isPending || remove.isPending }
}
