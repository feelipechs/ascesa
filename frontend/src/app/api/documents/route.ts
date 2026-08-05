import { NextRequest, NextResponse } from 'next/server'
import { getDocuments, createDocument } from '@/services/document.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { createDocumentSchema } from '@/schemas/document.schema'
import { documentFiltersSchema } from '@/schemas/document.filters.schema'

export async function GET(req: NextRequest) {
  return apiHandler(async () => {
    const { searchParams } = new URL(req.url)
    const query = Object.fromEntries(searchParams.entries())
    const parsed = documentFiltersSchema.safeParse(query)
    if (!parsed.success) return validationError(parsed.error)

    const result = await getDocuments(parsed.data)

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
