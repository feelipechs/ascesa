import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, Dog, PawPrint, Syringe, Bone, ClipboardList } from 'lucide-react'

const donationMethods = [
  {
    title: 'PIX',
    description: 'Contribua com qualquer valor via PIX.',
    details: 'Chave PIX: ascesa@example.com\nCNPJ: 00.000.000/0001-00',
    icon: Heart,
  },
  {
    title: 'Doação de Materiais',
    description: 'Ração, medicamentos, cobertores e outros itens.',
    details: 'Entre em contato para saber o que estamos precisando no momento.',
    icon: Dog,
  },
  {
    title: 'Seja um Padrinho',
    description: 'Contribua mensalmente com um valor fixo.',
    details: 'Ajude a manter nossos animais com um valor a partir de R$ 20/mês.',
    icon: PawPrint,
  },
  {
    title: 'Castração Solidária',
    description: 'Ajude a financiar castrações de animais de rua.',
    details: 'Cada castração evita novos abandonos. Contribua com qualquer valor.',
    icon: Syringe,
  },
]

const neededItems = [
  { icon: Bone, label: 'Ração seca e úmida' },
  { icon: Syringe, label: 'Medicamentos veterinários' },
  { icon: ClipboardList, label: 'Cobertores e toalhas' },
  { icon: Dog, label: 'Produtos de higiene' },
]

export function DonationsContent() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl text-balance">Como ajudar</h1>
        <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
          Sua contribuição faz a diferença na vida de centenas de animais. Escolha a forma que
          melhor se encaixa para você.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
        {donationMethods.map((method) => (
          <Card key={method.title} className="flex flex-col">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-3">
                <method.icon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">{method.title}</CardTitle>
              <CardDescription>{method.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <p className="text-sm text-muted-foreground whitespace-pre-line mb-4">
                {method.details}
              </p>
              <Button variant="outline" className="w-full" asChild>
                <a href="/contato">Quero contribuir</a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-accent/10 border-accent/20">
        <CardContent className="pt-6">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-4">Itens que precisamos</h2>
              <p className="text-muted-foreground mb-6">
                Além de doações em dinheiro, aceitamos doações de materiais. Entre em contato para
                combinar a entrega.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {neededItems.map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-sm">
                    <item.icon className="h-4 w-4 text-primary shrink-0" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4 bg-background rounded-xl p-6 border">
              <h3 className="font-semibold text-lg">Dúvidas?</h3>
              <p className="text-sm text-muted-foreground">
                Entre em contato conosco para mais informações sobre como ajudar.
              </p>
              <Button asChild>
                <a href="/contato">Fale Conosco</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
