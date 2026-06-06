'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BlogGrid } from './blog-grid'
import { BlogFilters } from './blog-filters'
import { SharedPagination } from '@/components/pagination'
import { useBlogFilter } from '@/hooks/use-blog-filter'
import { usePosts, usePostMutations } from '@/hooks/posts/queries'
import { DeleteDialog } from '@/components/delete-dialog'
import { getPageNumbers } from '@/lib/utils'
import { routes } from '@/lib/routes'
import type { Post } from '@/types'

export function BlogContent({ isAuthenticated }: { isAuthenticated: boolean }) {
  const router = useRouter()
  const [deletingPost, setDeletingPost] = useState<null | Post>(null)
  const { remove, isPending } = usePostMutations()

  const { searchQuery, currentPage, handleSearch, handlePageChange } = useBlogFilter()

  const { data, isLoading } = usePosts({
    search: searchQuery || undefined,
    page: currentPage,
    limit: 12,
    includeDrafts: isAuthenticated,
  })

  const posts = data?.data ?? []
  const totalPages = data?.meta.totalPages ?? 1

  return (
    <div className="space-y-12">
      <section>
        {isAuthenticated && (
          <div className="flex justify-end mb-6">
            <Button size="sm" onClick={() => router.push(`${routes.blog}/posts/new`)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
        )}

        <BlogFilters searchQuery={searchQuery} onSearchChange={handleSearch} />

      <div className="mt-6">
        <BlogGrid
          posts={posts}
          isLoading={isLoading}
          isAuthenticated={isAuthenticated}
          onEdit={(post) => router.push(`${routes.blog}/posts/${post.id}/edit`)}
          onDelete={(post) => setDeletingPost(post)}
        />
      </div>

        <SharedPagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageNumbers={getPageNumbers(currentPage, totalPages)}
          onPageChange={handlePageChange}
        />
      </section>

      {isAuthenticated && (
        <DeleteDialog
          open={!!deletingPost}
          onClose={() => setDeletingPost(null)}
          onConfirm={() => {
            if (deletingPost) remove.mutate(deletingPost.id, { onSuccess: () => setDeletingPost(null) })
          }}
          entity="post"
          description="Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita."
          isPending={isPending}
        />
      )}
    </div>
  )
}
