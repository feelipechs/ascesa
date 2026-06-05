import { Html, Head, Body, Container, Heading, Text, Hr } from '@react-email/components'

type VolunteerRejectedEmailProps = {
  volunteerName: string
  projectTitle: string
}

export function VolunteerRejectedEmail({ volunteerName, projectTitle }: VolunteerRejectedEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Inscrição não aprovada</Heading>
          <Hr style={hr} />
          <Text style={text}>Olá, {volunteerName}!</Text>
          <Text style={text}>
            Infelizmente, sua inscrição como voluntário(a) no projeto <strong>{projectTitle}</strong> não foi aprovada desta vez.
          </Text>
          <Text style={text}>
            Agradecemos seu interesse em contribuir com a Ascesa. Fique à vontade para se inscrever em futuros projetos.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>Ascesa — Cuidando dos que mais precisam</Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = { backgroundColor: '#f9f9f9', fontFamily: 'sans-serif' }
const container = { margin: '0 auto', padding: '24px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#943f00', marginBottom: '8px' }
const hr = { borderColor: '#fe7f16', margin: '16px 0' }
const text = { fontSize: '14px', lineHeight: '1.6', color: '#333' }
const footer = { fontSize: '12px', color: '#999', textAlign: 'center' as const }
