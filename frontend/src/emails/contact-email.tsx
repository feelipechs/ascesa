import { Html, Head, Body, Container, Heading, Text, Hr, Section, Row, Column } from '@react-email/components'

type ContactEmailProps = {
  name: string
  email: string
  subject: string
  message: string
}

export function ContactEmail({ name, email, subject, message }: ContactEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Novo contato pelo site</Heading>
          <Hr style={hr} />
          <Section>
            <Row style={row}>
              <Column style={label}>Nome:</Column>
              <Column style={value}>{name}</Column>
            </Row>
            <Row style={row}>
              <Column style={label}>Email:</Column>
              <Column style={value}>{email}</Column>
            </Row>
            <Row style={row}>
              <Column style={label}>Assunto:</Column>
              <Column style={value}>{subject}</Column>
            </Row>
          </Section>
          <Hr style={hr} />
          <Heading as="h2" style={h2}>Mensagem</Heading>
          <Text style={messageText}>{message}</Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = { backgroundColor: '#f9f9f9', fontFamily: 'sans-serif' }
const container = { margin: '0 auto', padding: '24px', maxWidth: '560px' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#943f00', marginBottom: '8px' }
const h2 = { fontSize: '16px', fontWeight: '600', color: '#943f00', marginBottom: '8px' }
const hr = { borderColor: '#fe7f16', margin: '16px 0' }
const row = { marginBottom: '8px' }
const label = { fontWeight: '600', color: '#943f00', width: '100px', verticalAlign: 'top' as const }
const value = { color: '#333', verticalAlign: 'top' as const }
const messageText = { fontSize: '14px', lineHeight: '1.6', color: '#333', backgroundColor: '#fff', padding: '16px', borderRadius: '6px', border: '1px solid #e5e5e5' }
