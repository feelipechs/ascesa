'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarDays, ArrowRight, User } from 'lucide-react'
import { SafeImage } from '@/components/safe-image'
import { ImagePlaceholder } from '@/components/image-placeholder'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Post } from '@/types'

export function BlogCard({ post }: { post: Post }) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden py-0 gap-0 border-border/50 transition-[transform,box-shadow,border-color] duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-border">
      <div className="relative aspect-[3/2] shrink-0 overflow-hidden">
        {post.coverUrl ? (
          <SafeImage
            src={post.coverUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <ImagePlaceholder className="h-full w-full" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <CardContent className="flex flex-1 flex-col p-5 md:p-6">
        {post.publishedAt && (
          <div className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
            <time dateTime={new Date(post.publishedAt).toISOString()}>
              {format(new Date(post.publishedAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </time>
          </div>
        )}

        <h3 className="text-xl font-semibold tracking-tight mb-2 line-clamp-2 group-hover:text-primary">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>

        {post.excerpt && (
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 flex-1">
            {post.excerpt}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-4">
          {post.author ? (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <User className="h-3.5 w-3.5 shrink-0" />
              <span>{post.author}</span>
            </div>
          ) : (
            <span />
          )}
          <Button asChild variant="ghost" size="sm" className="group/btn">
            <Link href={`/blog/${post.slug}`}>
              Ler mais
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
