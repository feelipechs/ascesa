import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { PostForm } from '@/components/admin/forms/post-form'

type EditBlogPostPageProps = {
  params: Promise<{ id: string }>
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const session = await auth()
  if (!session) redirect('/blog')

  const { id } = await params

  return (
    <main className="flex flex-col pt-17.5 py-16 md:py-24">
      <PostForm postId={id} mode="page" />
    </main>
  )
}
