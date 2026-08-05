import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { z } from 'zod'
import { Prisma } from '@/generated/prisma/client'
import { headers } from 'next/headers'

export class BusinessError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
  ) {
    super(message)
    this.name = 'BusinessError'
  }
}

function handlePrismaError(error: Prisma.PrismaClientKnownRequestError): NextResponse {
  switch (error.code) {
    case 'P2002':
      return NextResponse.json(
        { error: 'Já existe um registro com esses dados.' },
        { status: 409 }
      )
    case 'P2003':
      return NextResponse.json(
        { error: 'Não é possível excluir: existem registros dependentes vinculados.' },
        { status: 409 }
      )
    case 'P2025':
      return NextResponse.json(
        { error: 'Registro não encontrado.' },
        { status: 404 }
      )
    default:
      return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}

export async function apiHandler(fn: () => Promise<NextResponse>): Promise<NextResponse> {
  try {
    return await fn()
  } catch (err) {
    if (err instanceof BusinessError) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode })
    }
    console.error(err)
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return handlePrismaError(err)
    }
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export function validationError(error: z.ZodError): NextResponse {
  const message = error.issues.map((i) => i.message).join(', ')
  return NextResponse.json(
    { error: message, fields: error.flatten().fieldErrors },
    { status: 400 }
  )
}

export async function protectedApiHandler(
  fn: (session: NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>) => Promise<NextResponse>,
  options?: { role?: 'ADMIN' | 'STAFF' }
) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  if (options?.role && session.user.role !== options.role) {
    return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
  }

  try {
    return await fn(session)
  } catch (error) {
    if (error instanceof BusinessError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    console.error(error)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return handlePrismaError(error)
    }
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
