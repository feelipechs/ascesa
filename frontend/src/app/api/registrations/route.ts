import { NextRequest, NextResponse } from 'next/server'
import { RegistrationService } from '@/services/registration.service'
import { apiHandler, protectedApiHandler, validationError } from '@/lib/api-handler'
import { publicRegistrationSchema } from '@/schemas/registration.schema'

export async function GET(req: NextRequest) {
  return protectedApiHandler(async () => {
    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get('projectId') ?? undefined
    const volunteerId = searchParams.get('volunteerId') ?? undefined
    const status = searchParams.get('status') ?? undefined
    const registrations = await RegistrationService.findAll({ projectId, volunteerId, status })
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
