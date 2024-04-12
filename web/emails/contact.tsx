import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Text
} from '@react-email/components'
import { Tailwind } from '@react-email/tailwind'
import * as React from 'react'

type ContactEmailProps = {
  firstName: string
  lastName: string
  email: string
  message: string
  date: string
  authorsMailingList: string[]
}

const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/gallery` : '/static'

export default function ContactEmail({
  firstName,
  lastName,
  email,
  message,
  date,
  authorsMailingList
}: ContactEmailProps) {
  const fullName = `${firstName} ${lastName}`

  return (
    <Html>
      <Head />
      <Preview>{fullName} sent a message!</Preview>
      <Tailwind>
        <Body className="bg-black font-mono">
          <Container className="px-3 mx-auto">
            <h1 className="text-xl font-bold text-white p-0">new message from {firstName}</h1>
            <Text className="text-gray-300 my-6">
              {fullName} sent a message from{' '}
              <Link
                href={`mailto:${email}`}
                target="_blank"
                referrerPolicy="no-referrer"
                className="text-[#04dcd4] underline"
              >
                {email}
              </Link>{' '}
              on {date}.
            </Text>
            <Text className="text-gray-300 mt-6">message:</Text>
            <textarea
              readOnly
              defaultValue={message}
              rows={7}
              className="text-sm p-4 resize-none font-mono rows block w-11/12 min-h-20 h-auto bg-black rounded-none border border-gray-600 text-white"
            />
            <Text className="text-gray-500 my-6">
              share the message with the other authors before replying.
            </Text>
            <Link
              href={`mailto:${email}?subject=Particles on Canvas Team Reply&bcc=${authorsMailingList.join(
                ','
              )}`}
              className="bg-white border text-sm text-black border-gray-600 rounded-none px-4 py-2 my-4"
            >
              click to reply
            </Link>
            <Img
              src={`${baseUrl}/the-one.jpeg`}
              width="52"
              height="52"
              className="mt-8"
              alt="Particles on Canvas's Image"
            />
            <Text className="text-gray-500 text-sm leading-6 mt-3 mb-6">
              <Link
                href="https://particles-on-canvas.vercel.app"
                target="_blank"
                referrerPolicy="no-referrer"
                className="text-[#04dcd4] underline"
              >
                Particles on Canvas
              </Link>
              <br /> creating digital art to further scientific divulgation.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

ContactEmail.PreviewProps = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@doe.com',
  message:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In et felis lectus. Sed tincidunt vel lacus sit amet ultrices.\n\nVestibulum efficitur turpis et tellus vehicula malesuada. Phasellus luctus ex eget ipsum fringilla, at suscipit erat mattis. Quisque volutpat hendrerit ipsum eget mattis. Integer odio quam, fermentum eget condimentum id, lobortis eget nisi. Donec ultrices dolor libero, ac facilisis mi vulputate ac. Praesent scelerisque lacinia odio vel varius. Proin suscipit vel diam vel dignissim. Praesent id leo at sem imperdiet commodo. Fusce lacus lacus, suscipit non venenatis congue, blandit ac leo. Maecenas ultrices dui ligula, sed sagittis felis feugiat a. Praesent eget blandit est, facilisis volutpat odio. Sed sed accumsan dolor, hendrerit semper augue. Integer magna velit, rhoncus euismod condimentum faucibus, porttitor tempus elit. Sed bibendum leo non ante gravida, non aliquam eros luctus.',
  date: new Date().toString(),
  authorsMailingList: ['foo@bar.com', 'abc@def.gh']
} as ContactEmailProps
