import { NextRequest, NextResponse } from 'next/server'
import argon2 from 'argon2'
import { prisma } from '@/lib/prisma'
import { protectedApiHandler, validationError } from '@/lib/api-handler'
import { createUserSchema } from '@/schemas/user.schema'

const userSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const

export async function GET() {
  return protectedApiHandler(async () => {
    const users = await prisma.user.findMany({
      select: userSelect,
      orderBy: { createdAt: 'desc' },
    })
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
    const hashedPassword = await argon2.hash(parsed.data.password)
    const user = await prisma.user.create({
      data: {
        email: parsed.data.email,
        password: hashedPassword,
        name: parsed.data.name,
        role: parsed.data.role ?? 'STAFF',
      },
      select: userSelect,
    })
    return NextResponse.json(user, { status: 201 })
  }, { role: 'ADMIN' })
}
