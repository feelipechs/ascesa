import { NextRequest, NextResponse } from 'next/server'
import { protectedApiHandler, validationError } from '@/lib/api-handler'
import { hashPassword } from '@/lib/password'
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

    const { password, ...fields } = parsed.data
    const data: Record<string, unknown> = { ...fields }

    if (password) {
      const account = await MeService.findCredentialAccount(session.user.id)
      const passwordHash = await hashPassword(password)
      await MeService.upsertCredentialAccount(session.user.id, passwordHash, account?.id)
    }

    const user = await MeService.updateProfile(session.user.id, data)
    return NextResponse.json(user)
  })
}
