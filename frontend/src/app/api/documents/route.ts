import { NextRequest, NextResponse } from 'next/server'
import { getDocuments, createDocument } from '@/services/document.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { createDocumentSchema } from '@/schemas/document.schema'

export async function GET(req: NextRequest) {
  return apiHandler(async () => {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') ?? ''
    const categoryId = searchParams.get('categoryId') ?? ''
    const year = searchParams.get('year')
    const page = Number(searchParams.get('page') ?? '1')
    const limit = Number(searchParams.get('limit') ?? '10')

    const result = await getDocuments({
      search,
      categoryId,
      ...(year && { year: Number(year) }),
      page,
      limit,
    })

    return NextResponse.json(result)
  })
}

export async function POST(req: NextRequest) {
  return protectedApiHandler(async () => {
    const body = await req.json()
    const parsed = createDocumentSchema.safeParse(body)
    if (!parsed.success) {
      return validationError(parsed.error)
    }
    const document = await createDocument(parsed.data)
    return NextResponse.json(document, { status: 201 })
  })
}
