import { ErrorResponse, Resend } from 'resend'

import ContactEmail from '@/emails/contact'

const resend = new Resend(process.env.RESEND_API_KEY)
const authorsMailingList = process.env.AUTHORS_MAILING_LIST?.split(',') || []

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, message } = await request.json()

    const emails: string[] = []
    const errors: ErrorResponse[] = []

    const date = new Date().toString()

    await Promise.all(
      authorsMailingList.map(async (authorEmail) => {
        const { data, error } = await resend.emails.send({
          from: `Particles on Canvas <${process.env.FROM_EMAIL!}>`,
          to: authorEmail,
          subject: `Contact from ${firstName} ${lastName}`,
          react: ContactEmail({
            firstName,
            lastName,
            email,
            message,
            date,
            authorsMailingList: authorsMailingList.filter((email) => email !== authorEmail)
          })
        })

        if (error) {
          errors.push(error)
        } else if (data) {
          emails.push(data.id)
        }
      })
    )

    if (errors.length > 0) {
      return new Response(JSON.stringify({ errors }), { status: 400 })
    }

    return new Response(JSON.stringify({ emails }), { status: 200 })
  } catch (error) {
    return Response.json({ error })
  }
}
