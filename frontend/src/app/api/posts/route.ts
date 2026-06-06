import { NextRequest, NextResponse } from 'next/server'
import { PostService } from '@/services/post.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { createPostSchema } from '@/schemas/post.schema'
import { auth } from '@/auth'
import { headers } from 'next/headers'

export async function GET(req: NextRequest) {
  return apiHandler(async () => {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') ?? undefined
    const page = Number(searchParams.get('page')) || undefined
    const limit = Number(searchParams.get('limit')) || undefined
    const includeDrafts = searchParams.get('includeDrafts') === 'true'

    if (includeDrafts) {
      const session = await auth.api.getSession({ headers: await headers() })
      if (!session) {
        return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
      }
      const result = await PostService.findAllPaginated({ search, page, limit })
      return NextResponse.json(result)
    }

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
