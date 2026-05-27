import { NextRequest, NextResponse } from 'next/server'
import { StatService } from '@/services/stat.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { createStatSchema } from '@/schemas/stat.schema'

export async function GET() {
  return apiHandler(async () => {
    const stats = await StatService.findAll()
    return NextResponse.json(stats)
  })
}

export async function POST(req: NextRequest) {
  return protectedApiHandler(async () => {
    const body = await req.json()
    const parsed = createStatSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)
    const stat = await StatService.create(parsed.data)
    return NextResponse.json(stat, { status: 201 })
  })
}
