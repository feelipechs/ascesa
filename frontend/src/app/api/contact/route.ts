import { NextRequest, NextResponse } from 'next/server'
import { apiHandler, validationError } from '@/lib/api-handler'
import { contactSchema } from '@/schemas/contact.schema'
import { EmailService } from '@/services/email.service'
import { getSettings } from '@/services/site-settings.service'

export async function POST(req: NextRequest) {
  return apiHandler(async () => {
    const body = await req.json()
    const parsed = contactSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)

    const settings = await getSettings()
    if (!settings.email) {
      return NextResponse.json(
        { error: 'Email de destino não configurado. Configure o email nas configurações do site.' },
        { status: 500 },
      )
    }

    await EmailService.sendContactEmail({
      ...parsed.data,
      to: settings.email,
    })

    return NextResponse.json({ status: 200 })
  })
}
