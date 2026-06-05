'use client'

import { BlogCard } from './blog-card'
import { EmptyState } from '@/components/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { Newspaper } from 'lucide-react'
import type { Post } from '@/types'

type BlogGridProps = {
  posts: Post[]
  isLoading?: boolean
  isAuthenticated?: boolean
  onEdit?: (post: Post) => void
  onDelete?: (post: Post) => void
}

export function BlogGrid({ posts, isLoading, isAuthenticated, onEdit, onDelete }: BlogGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={Newspaper}
        title="Nenhum post encontrado."
        description="Tente outros termos de busca."
      />
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in-0 duration-500">
    {posts.map((post) => (
      <BlogCard
        key={post.id}
        post={post}
        isAuthenticated={isAuthenticated}
        onEdit={onEdit ? () => onEdit(post) : undefined}
        onDelete={onDelete ? () => onDelete(post) : undefined}
      />
    ))}
    </div>
  )
}
