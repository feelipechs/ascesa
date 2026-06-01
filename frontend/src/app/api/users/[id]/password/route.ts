import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { protectedApiHandler, validationError } from '@/lib/api-handler'
import { updateUserPasswordSchema } from '@/schemas/user-password.schema'
import { verifyPassword, hashPassword } from '@/lib/utils-server'

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

    const account = await prisma.account.findFirst({
      where: { userId: id, providerId: 'credential' },
    })
    if (!account?.password) {
      return NextResponse.json({ error: 'Conta sem senha configurada' }, { status: 400 })
    }

    const isValid = await verifyPassword(account.password, parsed.data.currentPassword)
    if (!isValid) {
      return NextResponse.json({ error: 'Senha atual incorreta' }, { status: 400 })
    }

    const hashedPassword = await hashPassword(parsed.data.newPassword)
    await prisma.account.update({
      where: { id: account.id },
      data: { password: hashedPassword },
    })

    return new NextResponse(null, { status: 204 })
  })
}
