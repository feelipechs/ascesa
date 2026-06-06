import { NextRequest, NextResponse } from 'next/server'
import { protectedApiHandler, validationError } from '@/lib/api-handler'
import { updateMeSchema } from '@/schemas/me.schema'
import { MeService } from '@/services/me.service'

export async function GET() {
  return protectedApiHandler(async (session) => {
    const user = await MeService.getProfile(session.user.id)
    if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    return NextResponse.json(user)
  })
}

export async function PUT(req: NextRequest) {
  return protectedApiHandler(async (session) => {
    const body = await req.json()
    const parsed = updateMeSchema.safeParse(body)
    if (!parsed.success) {
      return validationError(parsed.error)
    }

    const user = await MeService.updateProfile(session.user.id, parsed.data)
    return NextResponse.json(user)
  })
}
