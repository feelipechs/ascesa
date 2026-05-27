import { useMutation, useQuery, useQueryClient, queryOptions } from '@tanstack/react-query'
import { toast } from 'sonner'
import { TestimonialsApi } from '@/lib/api/testimonials'
import { getErrorMessage } from '@/lib/utils'
import type { TestimonialFilters } from '@/types'

export const testimonialKeys = {
  all: ['testimonials'] as const,
  lists: () => [...testimonialKeys.all, 'list'] as const,
  list: (filters?: TestimonialFilters) => [...testimonialKeys.lists(), filters] as const,
  details: () => [...testimonialKeys.all, 'detail'] as const,
  detail: (id: string) => [...testimonialKeys.details(), id] as const,
}

export const testimonialsQueryOptions = (filters?: TestimonialFilters) =>
  queryOptions({
    queryKey: testimonialKeys.list(filters),
    queryFn: () => TestimonialsApi.findAll(filters),
  })

export const testimonialQueryOptions = (id: string | undefined) =>
  queryOptions({
    queryKey: testimonialKeys.detail(id ?? ''),
    queryFn: () => TestimonialsApi.findById(id!),
    enabled: !!id,
  })

export function useTestimonials(filters?: TestimonialFilters) {
  return useQuery(testimonialsQueryOptions(filters))
}

export function useTestimonial(id: string) {
  return useQuery(testimonialQueryOptions(id))
}

export function useTestimonialMutations() {
  const queryClient = useQueryClient()

  const onSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: testimonialKeys.all })
    toast.success(message)
  }

  const onError = (error: unknown, action: string) => {
    toast.error(`Falha ao ${action}`, { description: getErrorMessage(error) })
  }

  const create = useMutation({
    mutationFn: TestimonialsApi.create,
    onSuccess: () => onSuccess('Depoimento criado com sucesso!'),
    onError: (e) => onError(e, 'criar depoimento'),
  })

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => TestimonialsApi.update(id, data),
    onSuccess: () => onSuccess('Depoimento atualizado!'),
    onError: (e) => onError(e, 'atualizar depoimento'),
  })

  const remove = useMutation({
    mutationFn: TestimonialsApi.delete,
    onSuccess: () => onSuccess('Depoimento removido.'),
    onError: (e) => onError(e, 'remover depoimento'),
  })

  return {
    create,
    update,
    remove,
    isPending: create.isPending || update.isPending || remove.isPending,
  }
}
