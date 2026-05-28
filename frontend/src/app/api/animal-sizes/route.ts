import { NextRequest, NextResponse } from 'next/server'
import { getAnimalSizes, createAnimalSize } from '@/services/animal-size.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { createAnimalSizeSchema } from '@/schemas/animal-size.schema'

export async function GET() {
  return apiHandler(async () => {
    const sizes = await getAnimalSizes()
    return NextResponse.json({ data: sizes })
  })
}

export async function POST(req: NextRequest) {
  return protectedApiHandler(async () => {
    const body = await req.json()
    const parsed = createAnimalSizeSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)
    const size = await createAnimalSize(parsed.data)
    return NextResponse.json(size, { status: 201 })
  })
}
