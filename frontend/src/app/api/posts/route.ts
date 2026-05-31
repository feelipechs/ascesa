import { NextRequest, NextResponse } from 'next/server'
import { PostService } from '@/services/post.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { createPostSchema } from '@/schemas/post.schema'

export async function GET(req: NextRequest) {
  return apiHandler(async () => {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') ?? undefined
    const page = Number(searchParams.get('page')) || undefined
    const limit = Number(searchParams.get('limit')) || undefined

    const result = await PostService.findPublished({ search, page, limit })
    return NextResponse.json(result)
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
