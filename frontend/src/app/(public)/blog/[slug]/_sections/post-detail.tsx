'use client'

import { formatUTC } from '@/lib/utils-date'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, User } from 'lucide-react'
import { SafeImage } from '@/components/safe-image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Post } from '@/types'
import { sanitizeHtml } from '@/lib/sanitize'
import { routes } from '@/lib/routes'

type PostDetailProps = {
  post: Post
  isDraft?: boolean
  isAuthenticated?: boolean
}

export function PostDetail({ post, isDraft, isAuthenticated }: PostDetailProps) {
  return (
    <article>
      <div className="mb-8">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link href={routes.blog}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao blog
          </Link>
        </Button>

        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          {isDraft && isAuthenticated && (
            <Badge variant="outline" className="text-muted-foreground border-border/50 shrink-0">
              Rascunho
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {post.publishedAt && (
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 shrink-0" />
              <time dateTime={new Date(post.publishedAt).toISOString()}>
                {formatUTC(post.publishedAt, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </time>
            </div>
          )}
          {post.author && (
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4 shrink-0" />
              <span>{post.author}</span>
            </div>
          )}
        </div>
      </div>

      {post.coverMedia?.url && (
        <div className="relative mb-8 aspect-[2/1] overflow-hidden rounded-xl">
          <SafeImage
            src={post.coverMedia.url}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1100px"
            priority
          />
        </div>
      )}

      {post.content && (
        <div
          className="prose prose-lg dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-a:text-primary prose-img:rounded-lg"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
        />
      )}

      {!post.content && post.excerpt && (
        <p className="text-lg text-muted-foreground leading-relaxed">{post.excerpt}</p>
      )}
    </article>
  )
}
