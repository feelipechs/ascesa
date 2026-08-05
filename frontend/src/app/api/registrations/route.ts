import { NextRequest, NextResponse } from 'next/server'
import { RegistrationService } from '@/services/registration.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { publicRegistrationSchema } from '@/schemas/registration.schema'
import { paginationSchema } from '@/schemas/pagination.schema'
import { RegistrationStatus } from '@/generated/prisma/enums'

export async function GET(req: NextRequest) {
  return protectedApiHandler(async () => {
    const { searchParams } = new URL(req.url)
    const query = Object.fromEntries(searchParams.entries())
    const parsed = paginationSchema.safeParse(query)
    if (!parsed.success) return validationError(parsed.error)
    const statusParam = searchParams.get('status')
    const status = statusParam && statusParam in RegistrationStatus ? (statusParam as RegistrationStatus) : undefined
    const registrations = await RegistrationService.findAll({
      projectId: searchParams.get('projectId') ?? undefined,
      volunteerId: searchParams.get('volunteerId') ?? undefined,
      status,
      page: parsed.data.page,
      limit: parsed.data.limit,
    })
    return NextResponse.json(registrations)
  })
}

export async function POST(req: NextRequest) {
  return apiHandler(async () => {
    const body = await req.json()
    const parsed = publicRegistrationSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)
    const registration = await RegistrationService.publicRegister(parsed.data)
    return NextResponse.json(registration, { status: 201 })
  })
}
