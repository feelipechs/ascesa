import { redirect } from 'next/navigation'
import { routes } from '@/lib/routes'
import { auth } from '@/auth'
import { headers } from 'next/headers'
import { PostFormLoader } from '../_components/post-form-loader'

export default async function NewBlogPostPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect(routes.blog)

  return (
    <main className="flex flex-col pt-17.5 py-16 md:py-24">
      <PostFormLoader />
    </main>
  )
}
