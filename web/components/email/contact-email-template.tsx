type ContactEmailTemplateProps = {
  firstName: string
  lastName: string
  email: string
  message: string
}

export default function ContactEmailTemplate({
  firstName,
  lastName,
  email,
  message
}: ContactEmailTemplateProps) {
  return (
    <div>
      <h2>
        {firstName} {lastName} sent a message!
      </h2>
      <a href={`mailto:${email}`}>{email}</a>
      <h3>Message:</h3>
      <code>{message}</code>
    </div>
  )
}
