import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { protectedApiHandler, validationError } from '@/lib/api-handler'
import { updateUserSchema } from '@/schemas/user.schema'
import { Role } from '@/generated/prisma/enums'

type Params = { params: Promise<{ id: string }> }

const userSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const

export async function GET(_req: NextRequest, { params }: Params) {
  return protectedApiHandler(async () => {
    const { id } = await params
    const user = await prisma.user.findUnique({
      where: { id },
      select: userSelect,
    })
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
      const user = await prisma.user.update({
        where: { id },
        data: rest,
        select: userSelect,
      })
      return NextResponse.json(user)
    }

    if (parsed.data.role === Role.ADMIN) {
      const existingAdmin = await prisma.user.findFirst({
        where: { role: Role.ADMIN, id: { not: id } },
      })
      if (existingAdmin) {
        return NextResponse.json(
          { error: 'Já existe um administrador. Remova o atual antes de promover outro.' },
          { status: 409 }
        )
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data: parsed.data,
      select: userSelect,
    })
    return NextResponse.json(user)
  })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  return protectedApiHandler(async (session) => {
    const { id } = await params
    if (id === session.user.id) {
      return NextResponse.json({ error: 'Não pode deletar a si mesmo' }, { status: 400 })
    }
    await prisma.user.delete({ where: { id } })
    return new NextResponse(null, { status: 204 })
  }, { role: 'ADMIN' })
}
