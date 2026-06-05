import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PostService } from '@/services/post.service'
import { PostDetail } from './_sections'
import { PageSection } from '@/components/page-section'

type BlogPostPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await PostService.findBySlug(slug)

  if (!post || !post.publishedAt) {
    return { title: 'Post não encontrado — Ascesa' }
  }

  return {
    title: `${post.title} — Ascesa`,
    description: post.excerpt || `Leia "${post.title}" no blog da Ascesa.`,
    openGraph: post.coverMedia?.url
    ? { images: [{ url: post.coverMedia.url, alt: post.title }] }
      : undefined,
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await PostService.findBySlug(slug)

  if (!post || !post.publishedAt) {
    notFound()
  }

  return (
    <main className="flex flex-col pt-17.5">
      <section className="border-b border-border py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <PostDetail post={post} />
        </div>
      </section>
    </main>
  )
}
