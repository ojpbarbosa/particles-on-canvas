import { ErrorResponse, Resend } from 'resend'

import ContactEmail from '@/emails/contact'

const resend = new Resend(process.env.RESEND_API_KEY)
const authorsMailingList = process.env.AUTHORS_MAILING_LIST?.split(',') || []

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, message } = await request.json()

    const emails: { id: string }[] = []
    const errors: ErrorResponse[] = []

    const date = new Date().toString()

    authorsMailingList.forEach(async (authorEmail) => {
      const { data, error } = await resend.emails.send({
        from: `Particles on Canvas <${process.env.FROM_EMAIL!}>`,
        to: authorEmail,
        subject: `Contact from ${firstName} ${lastName}`,
        react: ContactEmail({ firstName, lastName, email, message, date, authorsMailingList })
      })

      if (error) {
        errors.push(error)
      } else {
        emails.push(data as { id: string })
      }
    })

    if (errors.length > 0) {
      return Response.json({ errors })
    }

    return Response.json({ emails })
  } catch (error) {
    return Response.json({ error })
  }
}
