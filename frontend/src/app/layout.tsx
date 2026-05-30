import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { QueryProvider } from '@/providers/query-provider'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from '@/components/ui/sonner'
import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'
import Script from 'next/script'

// unstable_cache é usado aqui pois é a única API do Next.js que suporta
// cache com revalidação para dados de configuração. Quando a API de cache
// for estabilizada, substituir por React.cache() + fetch com revalidate.

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const getSiteMetadata = unstable_cache(
  async () => prisma.siteSettings.findUnique({ where: { id: 'main' } }),
  ['site-metadata'],
  { revalidate: 3600 }
)

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteMetadata()

  return {
    title: {
      default: 'Ascesa — Amor e Cuidado por Cada Animal',
      template: '%s — Ascesa',
    },
    description:
      settings?.about ??
      'ONG dedicada ao resgate, cuidado e adoção de animais. Transformamos vidas através do acolhimento e da responsabilidade animal.',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {process.env.NODE_ENV === 'development' && (
          <Script src="//unpkg.com/react-scan/dist/auto.global.js" strategy="beforeInteractive" />
        )}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SessionProvider>
            <QueryProvider>{children}</QueryProvider>
          </SessionProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
