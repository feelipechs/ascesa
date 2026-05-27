'use client'

import { MoonIcon, SunIcon, MonitorIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full relative shrink-0">
          <SunIcon className="absolute size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Alternar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <SunIcon className="size-4" />
          Claro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <MoonIcon className="size-4" />
          Escuro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <MonitorIcon className="size-4" />
          Sistema
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
