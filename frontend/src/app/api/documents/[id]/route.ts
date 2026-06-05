import { NextRequest, NextResponse } from 'next/server'
import { getDocumentById, updateDocument, deleteDocument } from '@/services/document.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { updateDocumentSchema } from '@/schemas/document.schema'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  return apiHandler(async () => {
    const { id } = await params
    const document = await getDocumentById(id)
    if (!document) return NextResponse.json({ error: 'Documento não encontrado' }, { status: 404 })
    return NextResponse.json(document)
  })
}

export async function PUT(req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { id } = await params
    const body = await req.json()
    const parsed = updateDocumentSchema.safeParse(body)
    if (!parsed.success) {
      return validationError(parsed.error)
    }
    const document = await updateDocument(id, parsed.data)
    return NextResponse.json(document)
  })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { id } = await params
    await deleteDocument(id)
    return new NextResponse(null, { status: 204 })
  })
}
