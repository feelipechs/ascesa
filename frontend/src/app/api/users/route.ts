import { NextRequest, NextResponse } from 'next/server'
import { protectedApiHandler, validationError } from '@/lib/api-handler'
import { createUserSchema } from '@/schemas/user.schema'
import { UserService } from '@/services/user.service'

export async function GET() {
  return protectedApiHandler(async () => {
    const users = await UserService.findAll()
    return NextResponse.json({ data: users })
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
