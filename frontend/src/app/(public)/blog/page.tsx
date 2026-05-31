import type { Metadata } from 'next'
import { auth } from '@/auth'
import { BlogContent, BlogHero } from './_sections'
import { PageSection } from '@/components/page-section'

export const metadata: Metadata = {
  title: 'Blog — Ascesa',
  description: 'Histórias, reflexões e novidades sobre o nosso trabalho de resgate, cuidado e proteção dos animais.',
}

export default async function BlogPage() {
  const session = await auth()
  const isAuthenticated = !!session

  return (
    <main className="flex flex-col pt-17.5">
      <BlogHero />
      <PageSection padding="compact">
        <BlogContent isAuthenticated={isAuthenticated} />
      </PageSection>
    </main>
  )
}
