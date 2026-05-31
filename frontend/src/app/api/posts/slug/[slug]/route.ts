import { NextRequest, NextResponse } from 'next/server'
import { PostService } from '@/services/post.service'
import { apiHandler } from '@/lib/api-handler'

type Params = { params: Promise<{ slug: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  return apiHandler(async () => {
    const { slug } = await params
    const post = await PostService.findBySlug(slug)
    if (!post || !post.publishedAt) {
      return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 })
    }
    return NextResponse.json(post)
  })
}
