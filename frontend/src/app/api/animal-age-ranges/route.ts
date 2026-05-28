import { NextRequest, NextResponse } from 'next/server'
import { getAnimalAgeRanges, createAnimalAgeRange } from '@/services/animal-age-range.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { createAnimalAgeRangeSchema } from '@/schemas/animal-age-range.schema'

export async function GET() {
  return apiHandler(async () => {
    const ranges = await getAnimalAgeRanges()
    return NextResponse.json({ data: ranges })
  })
}

export async function POST(req: NextRequest) {
  return protectedApiHandler(async () => {
    const body = await req.json()
    const parsed = createAnimalAgeRangeSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)
    const range = await createAnimalAgeRange(parsed.data)
    return NextResponse.json(range, { status: 201 })
  })
}
