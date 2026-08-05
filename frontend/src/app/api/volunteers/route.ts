import { NextRequest, NextResponse } from 'next/server'
import { VolunteerService } from '@/services/volunteer.service'
import { protectedApiHandler, validationError } from '@/lib/api-handler'
import { createVolunteerSchema } from '@/schemas/volunteer.schema'
import { paginationSchema } from '@/schemas/pagination.schema'

export async function GET(req: NextRequest) {
  return protectedApiHandler(async () => {
    const { searchParams } = new URL(req.url)
    const query = Object.fromEntries(searchParams.entries())
    const parsed = paginationSchema.safeParse(query)
    if (!parsed.success) return validationError(parsed.error)
    const search = searchParams.get('search') ?? undefined
    const result = await VolunteerService.findAll({ search, page: parsed.data.page, limit: parsed.data.limit })
    return NextResponse.json(result)
  })
}

export async function POST(req: NextRequest) {
  return protectedApiHandler(async () => {
    const body = await req.json()
    const parsed = createVolunteerSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)
    const volunteer = await VolunteerService.create(parsed.data)
    return NextResponse.json(volunteer, { status: 201 })
  })
}
