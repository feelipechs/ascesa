import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { PostForm } from '@/components/admin/forms/post-form'

export default async function NewBlogPostPage() {
  const session = await auth()
  if (!session) redirect('/blog')

  return (
    <main className="flex flex-col pt-17.5 py-16 md:py-24">
      <PostForm mode="page" />
    </main>
  )
}
