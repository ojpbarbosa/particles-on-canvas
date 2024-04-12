import { Resend } from 'resend'

import ContactEmailTemplate from '@/components/email/contact-email-template'

const resend = new Resend(process.env.RESEND_API_KEY)
const authorsMailingList = process.env.AUTHORS_MAILING_LIST?.split(',') || []

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, message } = await request.json()

    const { data, error } = await resend.emails.send({
      from: `Particles on Canvas <${process.env.FROM_EMAIL!}>`,
      to: authorsMailingList,
      subject: `Contact from ${firstName} ${lastName}`,
      react: ContactEmailTemplate({ firstName, lastName, email, message })
    })

    if (error) {
      return Response.json({ error })
    }

    return Response.json({ data })
  } catch (error) {
    return Response.json({ error })
  }
}
