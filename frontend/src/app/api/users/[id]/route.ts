import { NextRequest, NextResponse } from 'next/server'
import { protectedApiHandler, validationError } from '@/lib/api-handler'
import { updateUserSchema } from '@/schemas/user.schema'
import { hashPassword } from '@/lib/password'
import { UserService } from '@/services/user.service'
import { prisma } from '@/lib/prisma'
import { Role } from '@/generated/prisma/enums'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { id } = await params
    const user = await UserService.findById(id)
    if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    return NextResponse.json(user)
  }, { role: 'ADMIN' })
}

export async function PUT(req: NextRequest, { params }: Params) {
  return protectedApiHandler(async (session) => {
    const { id } = await params
    const isAdmin = session.user.role === 'ADMIN'
    const isSelf = session.user.id === id

    if (!isAdmin && !isSelf) {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
    }

    const body = await req.json()
    const parsed = updateUserSchema.safeParse(body)
    if (!parsed.success) {
      return validationError(parsed.error)
    }

    if (!isAdmin) {
      const { role, ...rest } = parsed.data
      void role
      const user = await UserService.update(id, rest)
      return NextResponse.json(user)
    }

    if (parsed.data.role === Role.ADMIN) {
      const adminCount = await UserService.findAdminCount(id)
      if (adminCount > 0) {
        return NextResponse.json(
          { error: 'Já existe um administrador. Remova o atual antes de promover outro.' },
          { status: 409 }
        )
      }
    }

    const { password, ...userData } = parsed.data
    const data: Record<string, unknown> = { ...userData }

    if (password) {
      const hashedPassword = await hashPassword(password)
      const account = await UserService.findAccount(id)
      if (account) {
        await prisma.account.update({
          where: { id: account.id },
          data: { password: hashedPassword },
        })
      } else {
        await prisma.account.create({
          data: {
            userId: id,
            providerId: 'credential',
            accountId: id,
            password: hashedPassword,
          },
        })
      }
    }

    const user = await UserService.update(id, data)
    return NextResponse.json(user)
  })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  return protectedApiHandler(async (session) => {
    const { id } = await params
    if (id === session.user.id) {
      return NextResponse.json({ error: 'Não pode deletar a si mesmo' }, { status: 400 })
    }
    await UserService.delete(id)
    return new NextResponse(null, { status: 204 })
  }, { role: 'ADMIN' })
}
