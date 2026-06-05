import { NextResponse } from 'next/server'
import { getAreas, createArea } from '@/services/area.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { createAreaSchema } from '@/schemas/area.schema'
import { NextRequest } from 'next/server'

export async function GET() {
  return apiHandler(async () => {
    const areas = await getAreas()
    return NextResponse.json({ data: areas })
  })
}

export async function POST(req: NextRequest) {
  return protectedApiHandler(async () => {
    const body = await req.json()
    const parsed = createAreaSchema.safeParse(body)
    if (!parsed.success) {
      return validationError(parsed.error)
    }
    const area = await createArea(parsed.data)
    return NextResponse.json(area, { status: 201 })
  })
}
