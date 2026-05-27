import { NextRequest, NextResponse } from 'next/server'
import { getDocumentCategoryById, updateDocumentCategory, deleteDocumentCategory } from '@/services/document-category.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { updateDocumentCategorySchema } from '@/schemas/document-category.schema'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  return apiHandler(async () => {
    const { id } = await params
    const category = await getDocumentCategoryById(id)
    if (!category) return NextResponse.json({ error: 'Categoria não encontrada' }, { status: 404 })
    return NextResponse.json(category)
  })
}

export async function PUT(req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { id } = await params
    const body = await req.json()
    const parsed = updateDocumentCategorySchema.safeParse(body)
    if (!parsed.success) {
      return validationError(parsed.error)
    }
    const category = await updateDocumentCategory(id, parsed.data)
    return NextResponse.json(category)
  })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { id } = await params
    await deleteDocumentCategory(id)
    return new NextResponse(null, { status: 204 })
  })
}
