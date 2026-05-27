import { useMutation, useQuery, useQueryClient, queryOptions } from '@tanstack/react-query'
import { toast } from 'sonner'
import { GalleryImagesApi } from '@/lib/api/gallery-images'
import { getErrorMessage } from '@/lib/utils'
import type { GalleryImageFilters } from '@/types'

export const galleryImageKeys = {
  all: ['gallery-images'] as const,
  lists: () => [...galleryImageKeys.all, 'list'] as const,
  list: (filters?: GalleryImageFilters) => [...galleryImageKeys.lists(), filters] as const,
  details: () => [...galleryImageKeys.all, 'detail'] as const,
  detail: (id: string) => [...galleryImageKeys.details(), id] as const,
}

export const galleryImagesQueryOptions = (filters?: GalleryImageFilters) =>
  queryOptions({
    queryKey: galleryImageKeys.list(filters),
    queryFn: () => GalleryImagesApi.findAll(filters),
  })

export const galleryImageQueryOptions = (id: string | undefined) =>
  queryOptions({
    queryKey: galleryImageKeys.detail(id ?? ''),
    queryFn: () => GalleryImagesApi.findById(id!),
    enabled: !!id,
  })

export function useGalleryImages(filters?: GalleryImageFilters) {
  return useQuery(galleryImagesQueryOptions(filters))
}

export function useGalleryImage(id: string) {
  return useQuery(galleryImageQueryOptions(id))
}

export function useGalleryImageMutations() {
  const queryClient = useQueryClient()

  const onSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: galleryImageKeys.all })
    toast.success(message)
  }

  const onError = (error: unknown, action: string) => {
    toast.error(`Falha ao ${action}`, { description: getErrorMessage(error) })
  }

  const create = useMutation({
    mutationFn: GalleryImagesApi.create,
    onSuccess: () => onSuccess('Imagem criada com sucesso!'),
    onError: (e) => onError(e, 'criar imagem'),
  })

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => GalleryImagesApi.update(id, data),
    onSuccess: () => onSuccess('Imagem atualizada!'),
    onError: (e) => onError(e, 'atualizar imagem'),
  })

  const remove = useMutation({
    mutationFn: GalleryImagesApi.delete,
    onSuccess: () => onSuccess('Imagem removida.'),
    onError: (e) => onError(e, 'remover imagem'),
  })

  return {
    create,
    update,
    remove,
    isPending: create.isPending || update.isPending || remove.isPending,
  }
}
