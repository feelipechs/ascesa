import { NextRequest, NextResponse } from 'next/server'
import { getDocumentCategories, createDocumentCategory } from '@/services/document-category.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { createDocumentCategorySchema } from '@/schemas/document-category.schema'

export async function GET() {
  return apiHandler(async () => {
    const categories = await getDocumentCategories()
    return NextResponse.json({ data: categories })
  })
}

export async function POST(req: NextRequest) {
  return protectedApiHandler(async () => {
    const body = await req.json()
    const parsed = createDocumentCategorySchema.safeParse(body)
    if (!parsed.success) {
      return validationError(parsed.error)
    }
    const category = await createDocumentCategory(parsed.data)
    return NextResponse.json(category, { status: 201 })
  })
}
