import { NextRequest, NextResponse } from 'next/server'
import { protectedApiHandler, validationError } from '@/lib/api-handler'
import { updateUserPasswordSchema } from '@/schemas/user-password.schema'
import { verifyPassword, hashPassword } from '@/lib/password'
import { UserService } from '@/services/user.service'

type Params = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, { params }: Params) {
  return protectedApiHandler(async (session) => {
    const { id } = await params

    if (session.user.id !== id) {
      return NextResponse.json({ error: 'Só pode alterar a própria senha' }, { status: 403 })
    }

    const body = await req.json()
    const parsed = updateUserPasswordSchema.safeParse(body)
    if (!parsed.success) {
      return validationError(parsed.error)
    }

    const account = await UserService.findAccount(id)
    if (!account?.password) {
      return NextResponse.json({ error: 'Conta sem senha configurada' }, { status: 400 })
    }

    const isValid = await verifyPassword({ hash: account.password, password: parsed.data.currentPassword })
    if (!isValid) {
      return NextResponse.json({ error: 'Senha atual incorreta' }, { status: 400 })
    }

    const hashedPassword = await hashPassword(parsed.data.newPassword)
    await UserService.updateAccountPassword(account.id, hashedPassword)

    return new NextResponse(null, { status: 204 })
  })
}
