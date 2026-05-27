import { NextRequest, NextResponse } from 'next/server'
import argon2 from 'argon2'
import { prisma } from '@/lib/prisma'
import { protectedApiHandler, validationError } from '@/lib/api-handler'
import { updateUserPasswordSchema } from '@/schemas/user-password.schema'

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

    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    const isValid = await argon2.verify(user.password, parsed.data.currentPassword)
    if (!isValid) {
      return NextResponse.json({ error: 'Senha atual incorreta' }, { status: 400 })
    }

    const hashedPassword = await argon2.hash(parsed.data.newPassword)
    await prisma.user.update({ where: { id }, data: { password: hashedPassword } })

    return new NextResponse(null, { status: 204 })
  })
}
