import { NextRequest, NextResponse } from 'next/server'
import { protectedApiHandler, validationError } from '@/lib/api-handler'
import { createUserSchema } from '@/schemas/user.schema'
import { paginationSchema } from '@/schemas/pagination.schema'
import { UserService } from '@/services/user.service'

export async function GET(req: NextRequest) {
  return protectedApiHandler(async () => {
    const { searchParams } = new URL(req.url)
    const query = Object.fromEntries(searchParams.entries())
    const parsed = paginationSchema.safeParse(query)
    if (!parsed.success) return validationError(parsed.error)
    const result = await UserService.findAll(parsed.data)
    return NextResponse.json(result)
  }, { role: 'ADMIN' })
}

export async function POST(req: NextRequest) {
  return protectedApiHandler(async () => {
    const body = await req.json()
    const parsed = createUserSchema.safeParse(body)
    if (!parsed.success) {
      return validationError(parsed.error)
    }
    const user = await UserService.create(parsed.data)
    return NextResponse.json(user, { status: 201 })
  }, { role: 'ADMIN' })
}
