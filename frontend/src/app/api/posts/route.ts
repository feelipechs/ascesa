import { NextRequest, NextResponse } from 'next/server'
import { PostService } from '@/services/post.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { createPostSchema } from '@/schemas/post.schema'

export async function GET(req: NextRequest) {
  return apiHandler(async () => {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') ?? undefined
    const posts = await PostService.findAll()
    const filtered = search
      ? posts.filter(
          (p) =>
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.excerpt?.toLowerCase().includes(search.toLowerCase())
        )
      : posts
    return NextResponse.json(filtered)
  })
}

export async function POST(req: NextRequest) {
  return protectedApiHandler(async () => {
    const body = await req.json()
    const parsed = createPostSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)
    const post = await PostService.create(parsed.data)
    return NextResponse.json(post, { status: 201 })
  })
}
