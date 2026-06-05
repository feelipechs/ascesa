import { redirect } from 'next/navigation'
import { routes } from '@/lib/routes'
import { auth } from '@/auth'
import { headers } from 'next/headers'
import { PostFormLoader } from '../../_components/post-form-loader'

type EditBlogPostPageProps = {
  params: Promise<{ id: string }>
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect(routes.blog)

  const { id } = await params

  return (
    <main className="flex flex-col pt-17.5 py-16 md:py-24">
      <PostFormLoader postId={id} />
    </main>
  )
}
