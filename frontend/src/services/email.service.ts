import { render } from '@react-email/components'
import { resend, EMAIL_FROM } from '@/lib/resend'
import { ContactEmail } from '@/emails/contact-email'
import { VolunteerApprovedEmail } from '@/emails/volunteer-approved-email'
import { VolunteerRejectedEmail } from '@/emails/volunteer-rejected-email'

export const EmailService = {
  async sendContactEmail(data: {
    name: string
    email: string
    subject: string
    message: string
    to: string
  }) {
    const html = await render(
      ContactEmail({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      }),
    )

    return resend.emails.send({
      from: EMAIL_FROM,
      to: data.to,
      subject: `[Contato do site] ${data.subject}`,
      replyTo: data.email,
      html,
    })
  },

  async sendApprovedEmail(data: {
    to: string
    volunteerName: string
    projectTitle: string
  }) {
    const html = await render(
      VolunteerApprovedEmail({
        volunteerName: data.volunteerName,
        projectTitle: data.projectTitle,
      }),
    )

    return resend.emails.send({
      from: EMAIL_FROM,
      to: data.to,
      subject: `Inscrição aprovada — ${data.projectTitle}`,
      html,
    })
  },

  async sendRejectedEmail(data: {
    to: string
    volunteerName: string
    projectTitle: string
  }) {
    const html = await render(
      VolunteerRejectedEmail({
        volunteerName: data.volunteerName,
        projectTitle: data.projectTitle,
      }),
    )

    return resend.emails.send({
      from: EMAIL_FROM,
      to: data.to,
      subject: `Inscrição não aprovada — ${data.projectTitle}`,
      html,
    })
  },
}
