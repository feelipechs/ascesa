import { NextRequest, NextResponse } from 'next/server'
import { PostService } from '@/services/post.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { updatePostSchema } from '@/schemas/post.schema'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  return apiHandler(async () => {
    const { id } = await params
    const post = await PostService.findById(id)
    if (!post) return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 })
    return NextResponse.json(post)
  })
}

export async function PUT(req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { id } = await params
    const body = await req.json()
    const parsed = updatePostSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)
    const post = await PostService.update(id, parsed.data)
    return NextResponse.json(post)
  })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { id } = await params
    await PostService.delete(id)
    return new NextResponse(null, { status: 204 })
  })
}
