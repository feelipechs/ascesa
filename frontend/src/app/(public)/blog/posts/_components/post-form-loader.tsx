'use client'

import dynamic from 'next/dynamic'

const PostForm = dynamic(
  () => import('@/components/admin/forms/post-form').then((m) => ({ default: m.PostForm })),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto max-w-4xl px-4 lg:px-6 space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-10 animate-pulse rounded bg-muted" />
        <div className="h-10 animate-pulse rounded bg-muted" />
        <div className="h-20 animate-pulse rounded bg-muted" />
        <div className="h-[200px] animate-pulse rounded bg-muted" />
      </div>
    ),
  }
)

type PostFormLoaderProps = {
  postId?: string
}

export function PostFormLoader({ postId }: PostFormLoaderProps) {
  return <PostForm postId={postId} mode="page" />
}
