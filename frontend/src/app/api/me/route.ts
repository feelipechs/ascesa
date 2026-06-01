import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { protectedApiHandler, validationError } from '@/lib/api-handler'
import { hashPassword } from '@/lib/utils-server'
import { updateMeSchema } from '@/schemas/me.schema'

const userSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const

export async function GET() {
  return protectedApiHandler(async (session) => {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: userSelect,
    })
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
      const account = await prisma.account.findFirst({
        where: { userId: session.user.id, providerId: 'credential' },
      })
      if (account?.password) {
        await prisma.account.update({
          where: { id: account.id },
          data: { password: await hashPassword(password) },
        })
      } else {
        await prisma.account.create({
          data: {
            userId: session.user.id,
            providerId: 'credential',
            accountId: session.user.id,
            password: await hashPassword(password),
          },
        })
      }
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data,
      select: userSelect,
    })
    return NextResponse.json(user)
  })
}
