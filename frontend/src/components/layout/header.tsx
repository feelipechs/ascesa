'use client'

import { useEffect, useState } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/theme-toggle'
import { useSession } from 'next-auth/react'
import { UserMenu } from '@/components/user-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

const navigationData = [
  { title: 'Início', href: '/' },
  { title: 'Sobre', href: '/sobre' },
  { title: 'Projetos', href: '/projetos' },
  { title: 'Áreas de Atuação', href: '/areas' },
  { title: 'Transparência', href: '/transparencia' },
  { title: 'Doações', href: '/doacoes' },
  { title: 'Contato', href: '/contato' },
]

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-border bg-background/90 backdrop-blur-md shadow-sm shadow-border/30'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
        {/* LOGO */}
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="Ascesa" width={80} height={40} priority />
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navigationData.map((item) => {
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                )}
              >
                {item.title}
              </Link>
            )
          })}
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {session && <UserMenu />}

          {/* Mobile menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="size-5" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 py-4">
                {navigationData.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      pathname === item.href
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
